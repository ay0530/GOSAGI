import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import _ from 'lodash';
import { compare, hash } from 'bcrypt';

import { RedisService } from 'src/redis/redis.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async authSignup(email:string, password:string, name:string){
    return await this.userRepository.save({
      email, 
      password, 
      nickname: name
    })
}
  

  // ---- 회원 1명
  // 회원가입
  async signup(createDto: CreateUserDto) {
    try {
      // 이메일 중복 여부 체크
      const existingEmail = await this.findOneByEmail(createDto.email);
      if (existingEmail) {
        throw new ConflictException(
          '이미 해당 이메일로 가입된 사용자가 있습니다!',
        );
      }

      // 닉네임 중복 체크
      const existingName = await this.findOneByName(createDto.nickname);
      if (existingName) {
        throw new ConflictException(
          '이미 해당 이름으로 가입된 사용자가 있습니다!',
        );
      }

      // 비밀번호 확인 일치 여부 체크
      if (createDto.password !== createDto.passwordConfirm) {
        console.log('createDto.passwordConfirm: ', createDto.passwordConfirm);
        console.log('createDto.password: ', createDto.password);
        throw new BadRequestException('비밀번호가 일치하지 않습니다.');
      }

      const hashedPassword = await hash(createDto.password, 10); // 비밀번호 암호화

      // 회원 정보 저장
      const user = await this.userRepository.save({
        email: createDto.email,
        password: hashedPassword,
        nickname: createDto.nickname,
        role: createDto.role,
      });
      return {
        message: '회원가입이 완료되었습니다.',
        user: { id: user.id, email: user.email, nickname: user.nickname },
      };
    } catch (e) {
      console.log(e);
    }
  }

  // 로그인
  async login(email: string, password: string) {
    // 회원 정보 조회
    const user = await this.userRepository.findOne({
      select: ['id', 'email', 'password'],
      where: { email },
    });

    // ERR : 회원정보가 없는 경우
    if (_.isNil(user)) {
      throw new NotFoundException('이메일을 확인해주세요.');
    }

    // ERR : 비밀번호가 일치하지 않는 경우
    if (!(await compare(password, user.password))) {
      throw new NotFoundException('비밀번호를 확인해주세요.');
    }

    // access token 생성
    const payload = { id: user.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '10m' });

    // refresh token 생성
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    await this.redisService.setRefreshToken(String(user.id), refreshToken);

    return accessToken;
  }

  // 회원 정보 조회
  async findOne(id: number) {
    // 회원 정보 조회
    const user = await this.userRepository.findOne({ where: { id } });
    return { email: user.email, nickname: user.nickname };
  }

  // 회원 정보 수정
  async update(id: number, updateUserDto: UpdateUserDto) {
    // 회원 정보 수정
    await this.userRepository.update(
      { id },
      { nickname: updateUserDto.nickname },
    );
    return { nickname: updateUserDto.nickname };
  }

  // 회원 탈퇴
  async remove(id: number) {
    // 회원 정보 삭제
    await this.userRepository.delete({ id });
    // 쿠키 삭제
  }

  // ---- 회원 목록
  // 모든 회원 목록 조회
  async findAll() {
    const users = await this.userRepository.find();
    return users;
  }

  // 회원 목록 검색 조회
  async searchAll(category: string, keyword: string) {
    // 이메일, 이름, 역할로 검색 가능
    const users = this.userRepository
      .createQueryBuilder('user')
      .where(`user.${category} LIKE :keyword`, {
        keyword: `%${keyword}%`,
      })
      .getMany();

    return users;
  }

  async findOneByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async findOneByName(nickname: string) {
    return this.userRepository.findOne({ where: { nickname } });
  }
}

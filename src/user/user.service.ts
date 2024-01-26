import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import _ from 'lodash';
import { compare, hash } from 'bcrypt';

import { UserRoleType } from './types/userRole.type';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async authSignup(email: string, password: string, name: string) {
    return await this.userRepository.save({
      email,
      password,
      nickname: name,
    });
  }

  // ---- 회원 1명
  // 회원가입
  async signup(createUserDto: CreateUserDto) {
    // 이메일 중복 여부 체크
    const existingEmail = await this.findOneByEmail(createUserDto.email);
    if (existingEmail) {
      throw new ConflictException(
        '이미 해당 이메일로 가입된 사용자가 있습니다!',
      );
    }

    // // 닉네임 중복 체크
    // const existingName = await this.findOneByName(createUserDto.nickname);
    // if (existingName) {
    //   throw new ConflictException(
    //     '이미 해당 이름으로 가입된 사용자가 있습니다!',
    //   );
    // }

    // 비밀번호 확인 일치 여부 체크
    if (createUserDto.password !== createUserDto.passwordConfirm) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }

    const hashedPassword = await hash(createUserDto.password, 10); // 비밀번호 암호화

    // 회원 role 반환
    const roleValue: number = createUserDto.role;
    const userRole: UserRoleType = roleValue as UserRoleType;

    // 회원 정보 저장
    const user = await this.userRepository.save({
      email: createUserDto.email,
      password: hashedPassword,
      nickname: createUserDto.nickname,
      role: userRole,
    });
    return {
      message: '회원가입이 완료되었습니다.',
      user: { id: user.id, email: user.email, nickname: user.nickname },
    };
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

  // 회원 비밀번호 수정
  async updatePassword(
    email: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.findOneByEmail(email);
    const userPassword = user.password;

    // ERR : 비밀번호가 일치하지 않는 경우
    if (!(await compare(currentPassword, userPassword))) {
      throw new NotFoundException('비밀번호가 일치하지 않습니다.');
    }

    // ERR : 현재 비밀번호와 새 비밀번호가 일치한 경우
    if (currentPassword === newPassword) {
      throw new NotFoundException('현재 비밀번호와 일치합니다');
    }

    // 신규 비밀번호 암호화
    const hashedNewPassword = await hash(newPassword, 10);

    // 비밀번호 수정
    await this.userRepository.update(
      { email },
      { password: hashedNewPassword },
    );
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

  // 회원 정보 조회(조건 : 이메일)
  async findOneByEmail(email: string) {
    return this.userRepository.findOne({
      select: ['id', 'email', 'password', 'role'],
      where: { email },
    });
  }

  // async findOneByName(nickname: string) {
  //   return this.userRepository.findOne({ where: { nickname } });
  // }
}

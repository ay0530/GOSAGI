import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

import { RedisJwtService } from 'src/redis/redis-jwt.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly redisJwtService: RedisJwtService,
  ) {}

  // JWT 토큰 발급
  async generateJwtToken(user: any) {
    // 액세스 토큰 생성
    const payload = { id: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '10m' });

    // 리프레시 토큰 생성
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    await this.redisJwtService.setRefreshToken(String(user.id), refreshToken);

    return accessToken;
  }

  // 일반 로그인
  async login(email: string, password: string) {
    // 회원 정보 조회
    const user = await this.userService.findOneByEmail(email);

    // ERR : 회원정보가 없는 경우
    if (!user) {
      throw new NotFoundException('이메일을 확인해주세요.');
    }

    // ERR : 비밀번호가 일치하지 않는 경우
    if (!(await compare(password, user.password))) {
      throw new NotFoundException('비밀번호를 확인해주세요.');
    }

    // JWT 토큰 생성
    return await this.generateJwtToken(user);
  }

  // SNS 로그인
  async OAuthLogin({ req, res }) {
    const { email, password, name } = req.user;

    // 회원 정보 조회
    const user = await this.userService.findOneByEmail(email);

    // 회원이 존재하지 않을 경우
    if (!user) {
      const user = await this.userService.authSignup(email, password, name);
    }

    // JWT 토큰 생성
    return await this.generateJwtToken(user);
  }
}

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService,
    private readonly redisService: RedisService,
  ) {}

  // 액세스 토큰 발급
  async generateTokens(user: any) {
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '10m' });

    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    await this.redisService.setRefreshToken(String(user.id), refreshToken);

    return { access_token: accessToken };
  }

  async OAuthLogin({ req, res }) {
    const { email, name, password } = req.user;
    const existUser = await this.userService.findOneByEmail(email);

    if (!existUser) {
      const user = await this.userService.authSignup(email, name, password);
    }

    return await this.generateTokens(user);
  }
}

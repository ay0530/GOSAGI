import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';

@Injectable()
export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_KEY,
      callbackURL: process.env.KAKAO_REDIRECT,
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: any) {
    console.log('accessToken' + accessToken);
    console.log('refreshToken' + refreshToken);
    console.log(profile);
  }
}

import { Controller, Get, Query, Header, Res } from '@nestjs/common';
import { Response } from 'express';
import { KakaoService } from './kakao.service';

@Controller('auth')
export class KakaoController {
  constructor(private readonly kakaoService: KakaoService) {}

  @Get('kakao-login-page')
  async getKakaoInfo(@Query() query: { code }) {
    const apikey = 'e6fd4ce827c6e409f45124b2b7da2368';
    const redirectUri = 'http://localhost:3000/auth/kakao-login-page';
    await this.kakaoService.kakaoLogin(apikey, redirectUri, query.code);
  }

  @Get('kakao')
  @Header('Content-Type', 'text/html')
  async kakaoRedirect(@Res() res: Response): Promise<void> {
    const url =
      'https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=e6fd4ce827c6e409f45124b2b7da2368&redirect_uri=http://localhost:3000/auth/kakao-login-page';
    res.redirect(url);
  }
}

import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { JwtAuthGuard } from 'src/guards/jwt.guard';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // // 액세스 토큰 발급
  // @Get()
  // @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
  // async generateAccessToken(@Req() req) {
  //   return this.authService.generateAccessToken(req.user);
  // }

  @Get('login/kakao')
  @UseGuards(AuthGuard('kakao'))
  async loginKakao(@Req() req: Request & IOAuthUser, @Res() res: Response) {
    return await this.authService.OAuthLogin({ req, res });
  }
}

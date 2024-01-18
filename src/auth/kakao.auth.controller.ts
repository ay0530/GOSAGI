import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth/kakao-login')
export class kakaoAuthController {
  constructor(private readonly kakaoAuthService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin (@Req() req: Request, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.kakaoAuthService.getJWT(
        req.user.kakaoId,
    );

  }
  }
}

import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("login/naver")
  @UseGuards(AuthGuard("naver"))
  async loginNaver(
    @Req() req: Request & IOAuthUser,
    @Res() res: Response
  ) {  
    //Passport가 NaverStrategy로 리다이렉션합니다.
  
    return await this.authService.OAuthLogin({req, res})       
  }
  
  @Get("login/google")
  @UseGuards(AuthGuard("google"))
  async loginGoogle(
    @Req() req: Request & IOAuthUser, 
    @Res() res: Response
  ) {
    return await this.authService.OAuthLogin({ req, res });
  }
}

import {
  Body,
  Controller,
  Get,
  Post,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { IOAuthUser } from './IOauthInterface/ioauth.user.interface';

import { AuthService } from './auth.service';
import { RedisJwtService } from 'src/redis/redis-jwt.service';
import { LoginDto } from 'src/user/dto/login.dto';
import { ResponseDto } from 'src/ResponseDTO/response-dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly redisJwtService: RedisJwtService,
  ) {}

  // 일반 로그인
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: any,
  ) {
    const accessToken = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );
    res.cookie('authorization', `Bearer ${accessToken}`, {
      httpOnly: false,
    }); // 쿠키에 토큰 저장

    const response = new ResponseDto(true, '로그인이 완료되었습니다', null);
    return response;
  }

  // 네이버 로그인
  @Get('login/naver')
  @UseGuards(AuthGuard('naver'))
  async loginNaver(
    @Req() req: Request & IOAuthUser,
    @Res({ passthrough: true }) res: any,
  ) {
    //Passport가 NaverStrategy로 리다이렉션합니다.
    const accessToken = await this.authService.OAuthLogin({ req, res });
    res.cookie('authorization', `Bearer ${accessToken}`, {
      httpOnly: false,
    }); // 쿠키에 토큰 저장

    const response = new ResponseDto(true, '로그인이 완료되었습니다', null);

    // 로그인 성공 후 리다이렉트
    res.redirect('https://front.gosagi.com');
  }

  // 구글 로그인
  @Get('login/google')
  @UseGuards(AuthGuard('google'))
  async loginGoogle(
    @Req() req: Request & IOAuthUser,
    @Res({ passthrough: true }) res: any,
  ) {
    const accessToken = await this.authService.OAuthLogin({ req, res });
    res.cookie('authorization', `Bearer ${accessToken}`, {
      httpOnly: false,
    }); // 쿠키에 토큰 저장

    const response = new ResponseDto(true, '로그인이 완료되었습니다', null);

    // 로그인 성공 후 리다이렉트
    res.redirect('https://front.gosagi.com');
  }

  // 카카오 로그인
  @Get('login/kakao')
  @UseGuards(AuthGuard('kakao'))
  async loginKakao(
    @Req() req: Request & IOAuthUser,
    @Res({ passthrough: true }) res: any,
  ) {
    const accessToken = await this.authService.OAuthLogin({ req, res });
    res.cookie('authorization', `Bearer ${accessToken}`, {
      httpOnly: false,
    }); // 쿠키에 토큰 저장

    const response = new ResponseDto(true, '로그인이 완료되었습니다', null);

    // 로그인 성공 후 리다이렉트
    res.redirect('https://front.gosagi.com');
  }

  // 일반 로그아웃
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: any, @Res({ passthrough: true }) res: any) {
    // 액세스 토큰 삭제(빈 값을 덮어씌움)
    res.cookie('authorization', '', {
      httpOnly: true,
      expires: new Date(0), // 쿠키 유효기간 만료
    });
    await this.redisJwtService.removeRefreshToken(req.user.id); // 리프레시 토큰 삭제

    const response = new ResponseDto(true, '로그아웃 되었습니다', null);
    return response;
  }
}

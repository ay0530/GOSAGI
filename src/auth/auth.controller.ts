import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { JwtAuthGuard } from 'src/guards/jwt.guard';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 액세스 토큰 발급
  @Get()
  @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
  async generateAccessToken(@Req() req) {
    return this.authService.generateAccessToken(req.user);
  }
}

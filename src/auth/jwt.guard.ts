import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RedisService } from 'src/redis/redis.service';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      // 엑세스 토큰 조회
      const accessToken = request.cookies['authorization'];
      const [authType, authToken] = (accessToken ?? '').split(' ');
      const JWT_SECRET_KEY = this.configService.get('JWT_SECRET_KEY');
      const decodedToken = jwt.verify(authToken, JWT_SECRET_KEY);
      request.user = decodedToken; // req에 user로 추가
    } catch (error) {
      // 액세스 토큰 에러
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException('다시 로그인을 진행해주세요.');
      }
      // 액세스 토큰 유효기간 만료 에러
      if (error instanceof jwt.TokenExpiredError) {
        console.log(
          '액세스 토큰 유효기간 만료/리프레시 토큰이 없을 경우 재로그인 필요',
        );
        const refreshToken = await this.redisService.getRefreshToken(
          String(request.user.id),
        );
        // 리프레시 토큰 조회
        // 리프레시 토큰이 존재하지 않는 경우(기간 만료 || 로그아웃 || 계정 삭제)
        if (!refreshToken) {
          throw new UnauthorizedException('다시 로그인을 진행해주세요.');
        }
        return false;
      }
    }
    return true;
  }
}

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    // 엑세스 토큰 조회
    const accessToken = req.cookies['authorization'];
    const [authType, authToken] = (accessToken ?? '').split(' ');
    const JWT_SECRET_KEY = this.configService.get('JWT_SECRET_KEY');
    try {
      const decodedToken = jwt.verify(authToken, JWT_SECRET_KEY); // JWT 토큰 검증
      req.user = decodedToken; // 검증 성공 시 req에 user로 추가
    } catch (error) {
      // 액세스 토큰 에러
      if (error instanceof jwt.JsonWebTokenError) {
        // 액세스 토큰이 존재하지 않음
        if (!accessToken) {
          throw new UnauthorizedException('로그인을 진행해주세요.');
        }
        // 액세스 토큰 유효기간 만료 에러
        if (error instanceof jwt.TokenExpiredError) {
          // JWT 토큰의 payload 값 추출
          const expiredToken = jwt.decode(authToken);
          if (
            expiredToken &&
            typeof expiredToken === 'object' &&
            'id' in expiredToken
          ) {
            const userId = expiredToken.id;
            // 리프레시 토큰 조회
            const refreshToken =
              await this.redisService.getRefreshToken(userId);

            // 리프레시 토큰이 존재할 경우
            if (refreshToken) {
              // 액세스 토큰 재발급
              const payload = { id: userId };
              const accessToken = this.jwtService.sign(payload, {
                expiresIn: '10m',
              });
              // 쿠키에 토큰 저장
              res.cookie('authorization', `Bearer ${accessToken}`, {
                httpOnly: true,
              });
              req.user = payload; // req에 user로 추가
            }

            // 리프레시 토큰이 존재하지 않는 경우(기간 만료 || 로그아웃 || 계정 삭제)
            if (!refreshToken) {
              console.log('리프레시토큰 만료');
              throw new UnauthorizedException('다시 로그인을 진행해주세요.');
            }
          }
        }
      }
    }
    return true;
  }
}

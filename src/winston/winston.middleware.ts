import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { WinstonService } from './winston.service';

@Injectable()
export class WinstonMiddleware implements NestMiddleware {
  constructor(private readonly logger: WinstonService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req; // req에서 ip, method, api url 조회
    const userAgent = req.get('user-agent') || '';
    const start = Date.now(); // 요청 처리 시작 시간 체크

    // response가 완료되었을 때
    res.on('finish', () => {
      const { statusCode } = res; // 상태 코드 조회
      const responseTime = Date.now() - start; // 응답 시간 계산
      const errorMessage = res.locals.errorMessage // 에러 메시지 조회회
        ? res.locals.errorMessage
        : '';

      // 레벨별 로깅
      if (statusCode >= 400) {
        this.logger.error(
          `${method} - ${originalUrl} - ${statusCode} - ${responseTime}ms - ${ip} - ${userAgent} - ${errorMessage}`,
        );
      } else {
        this.logger.log(
          `${method} - ${originalUrl} - ${statusCode} - ${responseTime}ms - ${ip} - ${userAgent}`,
        );
      }
    });

    next();
  }
}

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { WinstonService } from './winston.service';

@Injectable()
export class WinstonMiddleware implements NestMiddleware {
  constructor(private readonly logger: WinstonService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    const start = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      console.log('statusCode: ', statusCode);
      const responseTime = Date.now() - start;
      const errorMessage = res.locals.errorMessage
        ? res.locals.errorMessage
        : '';

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

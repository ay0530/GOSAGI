import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Injectable,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WinstonService } from './winston.service';

@Injectable()
@Catch()
export class WinstonFilter implements ExceptionFilter {
  constructor(private readonly logger: WinstonService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    // 예외 유형에 따라 상태 코드와 메시지를 설정
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof Error ? exception.message : 'Internal Server Error';

    // 로그 메시지 생성 및 로깅

    const logMessage = `${request.method} ${request.url} - ${status} - ${message}`;
    if (status >= 400) this.logger.error(logMessage); // 에러 직접 찍기

    // 클라이언트에게 에러 응답 보내기
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: logMessage,
    });
  }
}

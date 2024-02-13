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

  // 예외 처리
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // http 실행 컨텍스트로 전환
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    // 예외 유형에 따라 상태 코드와 메시지를 설정
    const status =
      exception instanceof HttpException // 예외가 HttpException의 인스턴스인지 체크
        ? exception.getStatus() // 상태 코드 반환
        : HttpStatus.INTERNAL_SERVER_ERROR; // 500 애러로 처리
    const message =
      exception instanceof Error
        ? exception.message // 에러 메시지 조회
        : 'Internal Server Error'; // Internal Server Error 메시지 출력

    const logMessage = `${request.method} ${request.url} - ${status} - ${message}`; // 로그 메시지 생성
    if (status >= 400) this.logger.error(logMessage); // 에러가 존재할 경우 error 레벨로 로깅

    // res 반환
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: logMessage,
    });
  }
}

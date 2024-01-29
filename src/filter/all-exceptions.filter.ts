import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Logger } from 'winston';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  // 예외 발생 시 실행됨
  // ArgumentsHost : 실행 컨텍스트
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest();
    const response = context.getResponse();
    // HTTP 예외인 경우 상태 코드 가져오고 아니라면 상태 코드를 500으로 설정
    const status =
      // exception instanceof HttpException : 예외가 Http 예외인지 체크
      exception instanceof HttpException ? exception.getStatus() : 500;

    // 에러 로그 기록
    this.logger.error(`Status: ${status} Error: ${exception.toString()}`);

    // 클라이언트에 에러 응답 전달
    response.status(status).json({
      statusCode: status, // 상태코드
      timestamp: new Date().toISOString(), // 시간
      path: request.url,
    });
  }
}

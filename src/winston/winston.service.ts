import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import { winstonOptions } from './winston.config';

@Injectable()
export class WinstonService implements LoggerService {
  private readonly logger: winston.Logger =
    winston.createLogger(winstonOptions);

  // logger.@@() : winston을 이용하여 메시지를 기록
  error(message: string, context?: string) {
    // console.log('에러');
    this.logger.error(message, { context });
  }

  log(message: string, context?: string) {
    // console.log(`일반`);
    this.logger.info(message, { context });
  }

  warn(message: string, context?: string) {
    // console.log(`경고`);
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    // console.log(`디버그`);
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    // console.log(`상세`);
    this.logger.verbose(message, { context });
  }
}

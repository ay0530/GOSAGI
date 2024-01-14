import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filter/all-exceptions.filter'; // 예외 필터
import { WinstonModule } from 'nest-winston'; // 로깅
import winstonOptions from './config/winston.config'; // 로깅 옵션

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonOptions), // 로거 설정
  });
  app.useGlobalFilters(new AllExceptionsFilter(app.get('NestWinston'))); // 발생하는 예외 필터(throw new 필터)
  await app.listen(3000);
}
bootstrap();

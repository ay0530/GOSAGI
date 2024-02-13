import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonFilter } from './winston/winston.filter';
import { WinstonModule } from 'nest-winston';
import { winstonOptions } from './winston/winston.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonOptions), // 로거 설정
  });

  app.enableCors({
    origin: true,
    credentials: true,
    // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    // exposedHeaders: ['authorization'],
    // optionsSuccessStatus: 204, // Preflight 요청에 대한 성공 상태 코드
  });

  app.useGlobalFilters(new WinstonFilter(app.get('NestWinston')));

  await app.listen(3000);
}
bootstrap();

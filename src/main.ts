import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});

  app.enableCors({
    origin: true,
    credentials: true,
    // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    // exposedHeaders: ['authorization'],
    // optionsSuccessStatus: 204, // Preflight 요청에 대한 성공 상태 코드
  });

  await app.listen(3000);
}
bootstrap();

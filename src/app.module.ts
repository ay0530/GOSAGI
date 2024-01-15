import Joi from 'joi'; // 유효성 검증 라이브러리
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'; // DB 필드명 snake_case로 설정
import { ServeStaticModule } from '@nestjs/serve-static'; // 정적 파일 제공 모듈 (정적 파일 : 서버측 변경잆이 클라이언트에 전달되는 파일)
import { join } from 'path'; // 파일 경로 설정
import { WinstonModule } from 'nest-winston'; // 로깅
import winstonOptions from './config/winston.config'; // 로깅
import cookieParser from 'cookie-parser';

// Moudle
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from './redis/redis.module';

import { UserModule } from './user/user.module';
import { LocationModule } from './location/location.module';
import { StoreModule } from './store/store.module';
import { ProductModule } from './product/product.module';
import { ProductThumbnailModule } from './product-thumbnail/product-thumbnail.module';
import { ProductContentModule } from './product-content/product-content.module';
import { WishModule } from './wish/wish.module';
import { CartModule } from './cart/cart.module';
import { ReviewModule } from './review/review.module';
import { QuestionModule } from './question/question.module';
import { AnswerModule } from './answer/answer.module';
import { FaqModule } from './faq/faq.module';

// Entity
import { User } from './user/entities/user.entity';
import { Location } from './location/entities/locaion.entity';
import { Store } from './store/entities/store.entity';
import { Product } from './product/entities/product.entity';
import { ProductThumbnail } from './product-thumbnail/entities/product-thumbnail.entity';
import { ProductContent } from './product-content/entities/product-content.entity';
import { Wish } from './wish/entities/wish.entity';
import { Cart } from './cart/entities/cart.entity';
import { Review } from './review/entities/review.entity';
import { Question } from './question/entities/question.entity';
import { Answer } from './answer/entities/answer.entity';
import { Faq } from './faq/entities/faq.entity';

const typeOrmModuleOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: 'mysql',
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    database: configService.get('DB_NAME'),
    entities: [
      User,
      Location,
      Store,
      Product,
      ProductThumbnail,
      ProductContent,
      Wish,
      Cart,
      Review,
      Question,
      Answer,
      Faq,
    ],
    synchronize: configService.get('DB_SYNC'),
    logging: true,
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    // Joi
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET_KEY: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_NAME: Joi.string().required(),
        DB_SYNC: Joi.boolean().required(),
      }),
    }),
    // TypeORM
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    // JWT
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    // ServeStaticModule
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'views'), // 정적 파일을 제공하는 폴더(views)
      exclude: ['/api*'], // 특정 URL 패턴을 정적 파일에서 제외
    }),
    // Winston
    WinstonModule.forRoot(winstonOptions),
    // Auth
    AuthModule,
    RedisModule,
    // Module
    UserModule,
    LocationModule,
    StoreModule,
    ProductModule,
    ProductThumbnailModule,
    ProductContentModule,
    WishModule,
    CartModule,
    ReviewModule,
    QuestionModule,
    AnswerModule,
    FaqModule,
  ],
  controllers: [],
  providers: [],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes('*'); // 모든 라우터에 쿠키파서 적용
  }
}

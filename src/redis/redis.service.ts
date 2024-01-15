import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
/*
OnModuleInit : 모듈 초기화 시 Redis DB와 연결
OnModuleDestroy : 모듈 파괴 시 연결 종료
*/
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType; // redis DB와 상호작용 시 사용

  constructor(private configService: ConfigService) {}

  // redis 연결
  async onModuleInit() {
    this.client = createClient({
      // redis URL
      url: `redis://${this.configService.get(
        'REDIS_USERNAME',
      )}:${this.configService.get('REDIS_PASSWORD')}@${this.configService.get(
        'REDIS_HOST',
      )}:${this.configService.get('REDIS_PORT')}/0`,
    });

    this.client.on('error', (error) => console.error(`Redis Error: ${error}`));

    await this.client.connect();
    console.log('Connected to Redis');
  }

  // redis 연결 종료
  async onModuleDestroy() {
    await this.client.quit();
  }

  // refresh token 생성
  async setRefreshToken(userId: string, token: string): Promise<void> {
    await this.client.set(`refresh_token:${userId}`, token, {
      EX: 60 * 60 * 24 * 7, // 7일 유효기간
    });
  }

  // refresh token 조회
  async getRefreshToken(userId: string): Promise<string | null> {
    return await this.client.get(`refresh_token:${userId}`);
  }

  // refresh token 삭제
  async removeRefreshToken(userId: string): Promise<void> {
    await this.client.del(`refresh_token:${userId}`);
  }
}

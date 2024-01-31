import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisCoreService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType; // redis DB와 상호작용 시 사용
  private isConnected = false; // 연결 상태 플래그

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

    try {
      await this.client.connect();
      this.isConnected = true; // 연결 성공시 플래그 업데이트
      console.log('Redis client connected');
    } catch (error) {
      console.error('Redis connection error:', error);
    }
  }

  // redis 연결 종료
  async onModuleDestroy() {
    await this.client.quit();
  }

  // client 초기화
  getClient(): RedisClientType {
    if (!this.isConnected) {
      throw new Error('Redis client is not connected');
    }
    return this.client;
  }

  // redis 연결 성공 값 반환
  public returnConnected(): boolean {
    return this.isConnected;
  }
}

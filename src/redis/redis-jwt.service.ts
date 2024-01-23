import { Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

import { RedisCoreService } from './redis-core.service';

@Injectable()
export class RedisJwtService {
  private client: RedisClientType;

  constructor(private readonly redisCoreService: RedisCoreService) {
    this.waitForConnection().then(() => {
      this.client = this.redisCoreService.getClient();
    });
  }

  // redis 연결이 완료된 후 반환 값 받아오기
  private async waitForConnection(): Promise<void> {
    while (!this.redisCoreService.returnConnected()) {
      await new Promise((resolve) => setTimeout(resolve, 100)); // redis 연결 시 까지 반복
    }
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

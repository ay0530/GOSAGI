import { Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

import { RedisCoreService } from './redis-core.service';

@Injectable()
export class RedisViewsService {
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

  // 최근 본 상품 목록에 데이터 추가
  async lpush(key: string, value: string): Promise<void> {
    await this.client.lPush(key, value); // lPush : 리스트 시작 부분에 값을 추가
  }

  // 최근 본 상품 목록 첫 번째에 추가
  async ltrim(key: string, start: number, stop: number): Promise<void> {
    await this.client.lTrim(key, start, stop); // lTrim : 리스트의 크기 조정
  }

  // 최근 본 상품 목록 최신순으로 정리
  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    return await this.client.lRange(key, start, stop); // lRange : 특정 범위의 데이터 조회
  }
}

import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import { RedisClientType } from 'redis';

import { RedisCoreService } from './redis-core.service';

const asyncReadFile = util.promisify(fs.readFile);

@Injectable()
export class RedisImageService {
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

  async saveImage(imagePath: string): Promise<void> {
    // 이미지 파일이 존재하는지 확인
    console.log(imagePath);
    if (!fs.existsSync(imagePath)) {
      throw new BadRequestException('Image file not found.');
    }

    // 이미지 파일 읽기
    const imageBuffer = await asyncReadFile(imagePath);

    const key = `image:${imagePath}`;

    // 이미지를 Redis에 저장
    this.client.set(key, imageBuffer, {
      EX: 60 * 60 * 24 * 30, // 30일 유효기간인데, 일단은 오케이?
    });
  }

  async getImage(imagePath: string): Promise<Buffer | null> {
    const key = `image:${imagePath}`;
    const imageData = await this.client.get(key);
    if (imageData) {
      return Buffer.from(imageData, 'binary');
    } else {
      return null;
    }
  }
}

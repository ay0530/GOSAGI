import { Injectable } from '@nestjs/common';
import { CreateTossDto } from './dto/create-toss.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class TossService {
  private readonly secretKey = 'test_sk_d46qopOB89OZXWzD1a6dVZmM75y0';
  private readonly encryptedSecretKey = `Basic ${Buffer.from(
    this.secretKey + ':',
  ).toString('base64')}`;

  constructor(private readonly httpService: HttpService) {}

  async confirmPayment(createTossDto: CreateTossDto): Promise<any> {
    const { paymentKey, orderId, amount } = createTossDto;

    const response = await this.httpService.axiosRef.post(
      'https://api.tosspayments.com/v1/payments/confirm',
      JSON.stringify({ orderId, amount, paymentKey }),
      {
        headers: {
          Authorization: this.encryptedSecretKey,
          'Content-Type': 'tosslication/json',
        },
      },
    );
    return response;
  }
}

import { Injectable } from '@nestjs/common';
import { CreateTossDto } from './dto/create-toss.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class TossService {
  private readonly secretKey = 'test_sk_eqRGgYO1r5jn6oQJyaRO8QnN2Eya';
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

import { IsNotEmpty } from 'class-validator';

export class CreateTossDto {
  @IsNotEmpty()
  paymentKey: string;

  @IsNotEmpty()
  orderId: string;

  @IsNotEmpty()
  amount: number;
}

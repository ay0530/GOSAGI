import { IsNotEmpty } from 'class-validator';

export class UpdateStoreDto {
  @IsNotEmpty({ message: '매장명을 입력해주세요.' })
  name: string;

  @IsNotEmpty({ message: '매장 연락처를 입력해주세요.' })
  phoneNumber: string;

  @IsNotEmpty({ message: '매장 주소를 입력해주세요.' })
  address: string;
}

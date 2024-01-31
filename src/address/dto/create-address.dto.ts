import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty({ message: '배송지명을 입력해 주세요.' })
  address_name: string;

  @IsNotEmpty({ message: '수령인을 입력해 주세요.' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: '전화번호를 입력해 주세요.' })
  @IsNumber()
  phone: number;

  @IsNotEmpty({ message: '주소를 입력해 주세요.' })
  @IsString()
  address: string;

  @IsNotEmpty({ message: '상세주소를 입력해 주세요.' })
  @IsString()
  detail_address: string;

  @IsNotEmpty({ message: '우편번호를 입력해 주세요.' })
  @IsNumber()
  post_code: number;
}

import { IsNotEmpty } from 'class-validator';

export class SearchOrderPeriodDto {
  @IsNotEmpty({ message: '시작 날짜를 입력해 주세요' })
  start_period: Date;

  @IsNotEmpty({ message: '끝 날짜를 입력해 주세요' })
  end_period: Date;
}

import { PartialType } from '@nestjs/swagger';
import { CreateKakaoDto } from './create-kakao.dto';

export class UpdateKakaoDto extends PartialType(CreateKakaoDto) {}

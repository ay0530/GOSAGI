import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ApprovalStatusType } from './types/approval-status.type';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from './entities/store.entity';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class StoreService {
  s3Client: S3Client;
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    private configService: ConfigService,
  ) {
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION'), // AWS Region
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'), // Access Key
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'), // Secret Key
      },
    });
  }

  // 매장 정보 저장
  async create(
    createStoreDto: CreateStoreDto,
    userId: number,
    fileName: string, // 업로드될 파일의 이름
    file: Express.Multer.File, // 업로드할 파일
    ext: string, // 파일 확장자
  ) {
    // 매장 정보 예외 처리
    await this.existingStore(createStoreDto);

    const command = new PutObjectCommand({
      Bucket: this.configService.get('AWS_BUCKET_NAME'), // S3 버킷 이름
      Key: fileName, // 업로드될 파일의 이름
      Body: file.buffer, // 업로드할 파일
      ACL: 'public-read', // 파일 접근 권한
      ContentType: `image/${ext}`, // 파일 타입
    });

    // 생성된 명령을 S3 클라이언트에 전달하여 이미지 업로드를 수행합니다.
    await this.s3Client.send(command);

    const licenseUrl = `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_BUCKET_NAME}/${fileName}`;

    // 매장 정보 저장
    const store = await this.storeRepository.save({
      user_id: userId,
      name: createStoreDto.name,
      phone_number: createStoreDto.phone_number,
      business_number: createStoreDto.business_number,
      address: createStoreDto.address,
      license_url: licenseUrl,
    });

    return store;
  }

  // 매장 정보 상세 조회
  async findOne(id: number) {
    const store = await this.storeRepository.findOne({
      where: { id },
    });

    return {
      name: store.name,
      phone_number: store.phone_number,
      business_number: store.business_number,
      address: store.address,
      aproval_status: store.approval_status,
      reasons_rejection: store.reasons_rejection,
      user_id: store.user_id,
    };
  }

  // 매장 정보 수정
  async update(id: number, updateStoreDto: UpdateStoreDto, userId: number) {
    // 매장 이름 조회
    const storeInfo = await this.findOne(id);
    const storeName = storeInfo.name;

    // 매장 정보 예외 처리
    if (storeName !== updateStoreDto.name) {
      await this.existingStore(updateStoreDto);
    }

    // 문의 글 상태 반환
    const statusValue: number = updateStoreDto.approvalStatus;
    const approval_status: ApprovalStatusType =
      statusValue as ApprovalStatusType;

    // 승인을 반려할 때 반려 사유가 작성되지 않은 경우
    if (
      updateStoreDto.approvalStatus === 2 &&
      updateStoreDto.reasonsRejection === ''
    ) {
      throw new BadRequestException(
        '상점 등록 승인 반려 시 반려 사유가 필요합니다',
      );
    }

    // 승인할 때 반려 사유가 작성된 경우
    if (
      updateStoreDto.approvalStatus === 1 &&
      updateStoreDto.reasonsRejection
    ) {
      throw new BadRequestException(
        '상점 등록 승인 시 반려 사유를 제거해주시기 바랍니다',
      );
    }

    // 매장 정보 수정
    const store = await this.storeRepository.update(
      { id, user_id: userId },
      {
        name: updateStoreDto.name,
        phone_number: updateStoreDto.phoneNumber,
        address: updateStoreDto.address,
        approval_status,
        reasons_rejection: updateStoreDto.reasonsRejection,
      },
    );

    // 수정 실패
    if (!store.affected && store.affected === 0) {
      // 가드로 나중에 빼야할듯
      throw new ForbiddenException('권한이 존재하지 않습니다');
    }

    return {
      name: updateStoreDto.name,
      phone_number: updateStoreDto.phoneNumber,
      address: updateStoreDto.address,
    };
  }

  // 신청취소
  async remove(id: number, userId: number) {
    const store = await this.storeRepository.delete({ id, user_id: userId });

    // 삭제 실패
    if (!store.affected && store.affected === 0) {
      // 가드로 나중에 빼야할듯
      throw new ForbiddenException('권한이 존재하지 않습니다');
    }
    return store; // 삭제 성공 시 삭제된 매장 정보 반환
  }

  // 매장 목록 조회
  async findAll() {
    const stores = await this.storeRepository.find();

    return stores;
  }

  // 매장 목록 검색 조회
  async searchAll(category: string, keyword: string) {
    // 매장명, 매장 연락처, 매장 주소로 검색 가능
    const stores = this.storeRepository
      .createQueryBuilder('store')
      .where(`store.${category} LIKE :keyword`, {
        keyword: `%${keyword}%`,
      })
      .getMany();

    return stores;
  }

  // ----- 기타 함수
  // 매장 정보 저장/수정 예외 처리
  async existingStore(storeDto: any) {
    // 매장명 중복 여부 체크
    const existingName = await this.storeRepository.findOne({
      where: { name: storeDto.name },
    });
    if (existingName) {
      throw new ConflictException('이미 등록된 매장입니다.');
    }
  }

  async findAppliedSeller() {
    const stores = await this.storeRepository.find({
      where: { approval_status: 0 },
    });

    return stores;
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/guards/jwt.guard';

import { UserService } from './user.service';
import { RedisService } from 'src/redis/redis.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisService,
  ) {}

  // ---- 회원 1명
  // 회원가입
  @Post('signup')
  async signup(@Body() createDto: CreateUserDto) {
    return await this.userService.signup(createDto);
  }

  // 로그인
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: any,
  ) {
    const accessToken = await this.userService.login(
      loginDto.email,
      loginDto.password,
    );
    res.cookie('authorization', `Bearer ${accessToken}`, {
      httpOnly: true,
    }); // 쿠키에 토큰 저장

    return {
      message: '로그인이 완료되었습니다.',
    };
  }

  // 회원 정보 조회
  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfile(@Req() req: any) {
    const user = await this.userService.findOne(req.user.id);
    return {
      message: '회원 정보 조회가 완료되었습니다.',
      user,
    };
  }

  // 회원 정보 수정
  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.update(req.user.id, updateUserDto);
    return {
      message: '회원 정보 수정이 완료되었습니다.',
      user,
    };
  }

  // 회원 탈퇴
  @UseGuards(JwtAuthGuard)
  @Delete()
  async remove(@Req() req: any, @Res({ passthrough: true }) res: any) {
    await this.userService.remove(req.user.id);
    // 액세스 토큰 삭제(빈 값을 덮어씌움)
    res.cookie('authorization', '', {
      httpOnly: true,
      expires: new Date(0), // 쿠키 유효기간 만료
    });
    await this.redisService.removeRefreshToken(req.user.id); // 리프레시 토큰 삭제
    return { message: '회원 탈퇴가 완료되었습니다' };
  }

  // 로그아웃
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: any, @Res({ passthrough: true }) res: any) {
    // 액세스 토큰 삭제(빈 값을 덮어씌움)
    res.cookie('authorization', '', {
      httpOnly: true,
      expires: new Date(0), // 쿠키 유효기간 만료
    });
    await this.redisService.removeRefreshToken(req.user.id); // 리프레시 토큰 삭제
    return { message: '로그아웃이 되었습니다' };
  }

  // ---- 회원 목록
  // 모든 회원 목록 조회
  @UseGuards(JwtAuthGuard)
  @Get('list')
  async findAll() {
    const users = await this.userService.findAll();
    return {
      message: '모든 회원 조회가 완료되었습니다.',
      users,
    };
  }

  // 회원 목록 검색 조회
  @UseGuards(JwtAuthGuard)
  @Get('list/:category/:keyword')
  async searchAll(
    @Param('category') category: string,
    @Param('keyword') keyword: string,
  ) {
    const users = await this.userService.searchAll(category, keyword);
    return {
      message: '검색이 완료되었습니다.',
      users,
    };
  }
}

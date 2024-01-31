import { IsEmail, IsInt, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: '이메일 형식을 올바르게 입력해주세요.' })
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  email: string;

  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  password: string;

  @IsNotEmpty({ message: '비밀번호 확인을 입력해주세요.' })
  passwordConfirm: string;

  @IsNotEmpty({ message: '이름을 입력해주세요.' })
  nickname: string;

  @IsInt({ message: '숫자를 입력해주세요.' })
  @IsNotEmpty({ message: '권한을 입력해주세요.' })
  role: number;
}

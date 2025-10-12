import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty({ message: 'LINE ID Token 為必填項目' })
  idToken: string;

  @IsString()
  @IsNotEmpty({ message: '姓名為必填項目' })
  @MinLength(2, { message: '姓名至少需要 2 個字元' })
  @MaxLength(20, { message: '姓名不能超過 20 個字元' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: '電話為必填項目' })
  @Matches(/^09\d{8}$/, {
    message: '請輸入正確的台灣手機號碼格式 (09xxxxxxxx)',
  })
  phone: string;

  @IsString()
  @IsNotEmpty({ message: '生日為必填項目' })
  birthday: string;

  @IsEmail({}, { message: '請輸入正確的電子信箱格式' })
  @IsNotEmpty({ message: '電子信箱為必填項目' })
  email: string;
}

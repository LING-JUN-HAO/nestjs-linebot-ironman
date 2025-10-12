import { Expose } from 'class-transformer';

export class UserResponseDto {
  /**
   * 使用者唯一識別碼
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  @Expose()
  id: string;

  /**
   * 使用者姓名
   * @example "王小明"
   */
  @Expose()
  name: string;

  /**
   * 使用者電子信箱
   * @example "example@gmail.com"
   */
  @Expose()
  email: string;

  /**
   * 使用者手機號碼
   * @example "0912345678"
   */
  @Expose()
  phone: string;

  /**
   * 使用者生日
   * @example "1990-01-01"
   */
  @Expose()
  birthday: string;

  /**
   * 帳號建立時間
   * @example "2023-09-15T08:30:00Z"
   */
  @Expose()
  created_at: string;

  /**
   * 帳號更新時間
   * @example "2023-09-15T08:30:00Z"
   */
  @Expose()
  updated_at: string;
}

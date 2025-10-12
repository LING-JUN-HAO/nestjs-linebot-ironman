import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { LineLoginService } from 'src/line-login/line-login.service';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class UserService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly supabaseService: SupabaseService,
    private readonly lineLoginService: LineLoginService,
  ) {
    this.logger.setContext(UserService.name);
  }

  /**
   * 註冊新使用者
   * @param registerUserDto 註冊使用者資料
   * @returns 註冊成功的使用者資料
   * @throws ConflictException 如果使用者已存在
   * @throws Error 如果發生其他錯誤
   */
  async register(registerUserDto: RegisterUserDto): Promise<UserResponseDto> {
    const supabase = this.supabaseService.db;
    const { idToken, ...userDataWithoutToken } = registerUserDto;

    try {
      const verifyResult = await this.lineLoginService.verifyIDToken(idToken);
      const lineUserId = verifyResult.sub;

      this.logger.info(`LINE Token 驗證成功，使用者 ID: ${lineUserId}`);

      // 檢查是否已註冊 (使用 LINE 使用者 ID 檢查)
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('*')
        .eq('id', lineUserId)
        .maybeSingle();

      // 處理查詢錯誤
      if (checkError) {
        this.logger.error(`查詢使用者錯誤: ${checkError.message}`);
        throw new Error(`查詢使用者時發生錯誤: ${checkError.message}`);
      }

      // 如果使用者已存在
      if (existingUser) {
        throw new ConflictException('此 LINE 帳號已註冊');
      }

      const newUserData = {
        ...userDataWithoutToken,
        id: lineUserId,
      };

      // 註冊新使用者
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([newUserData])
        .select()
        .single();

      // 處理插入錯誤
      if (insertError) {
        this.logger.error(`註冊使用者錯誤: ${insertError.message}`);
        throw new Error(`註冊使用者時發生錯誤: ${insertError.message}`);
      }

      return newUser;
    } catch (error) {
      this.logger.error(`LINE Token 驗證或註冊失敗: ${error.message}`);
      throw error;
    }
  }

  /**
   * 使用者登入
   * @param loginDto 登入使用者資料
   * @returns 登入成功的使用者資料
   * @throws UnauthorizedException 如果使用者不存在或 token 無效
   * @throws Error 如果發生其他錯誤
   */
  async login(loginDto: LoginUserDto): Promise<UserResponseDto> {
    const { idToken } = loginDto;

    try {
      // 驗證 LINE ID Token
      const verifyResult = await this.lineLoginService.verifyIDToken(idToken);
      const lineUserId = verifyResult.sub;

      this.logger.info(`LINE Token 驗證成功，使用者 ID: ${lineUserId}`);

      // 查詢使用者是否存在
      const { data: user, error } = await this.supabaseService.db
        .from('users')
        .select('*')
        .eq('id', lineUserId)
        .maybeSingle();

      // 處理查詢錯誤
      if (error) {
        this.logger.error(`查詢使用者錯誤: ${error.message}`);
        throw new Error(`查詢使用者時發生錯誤: ${error.message}`);
      }

      if (!user) {
        throw new UnauthorizedException('使用者不存在，請先註冊');
      }

      this.logger.info(`使用者登入成功: ${user.id}`);
      return user;
    } catch (error) {
      this.logger.error(`登入失敗: ${error.message}`);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('登入失敗，請檢查您的 ID Token');
    }
  }
}

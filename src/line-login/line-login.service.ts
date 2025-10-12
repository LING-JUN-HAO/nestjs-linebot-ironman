import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { TokenVerifyResponse } from './line-login.types';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom, throwError } from 'rxjs';

@Injectable()
export class LineLoginService {
  private readonly LINE_LOGIN_VERIFY_URL: string;
  private readonly LINE_LOGIN_CLIENT_ID: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.LINE_LOGIN_VERIFY_URL = this.configService.getOrThrow<string>(
      'line.loginVerifyUrl',
    );
    this.LINE_LOGIN_CLIENT_ID = this.configService.getOrThrow<string>(
      'line.loginChannelId',
    );
  }

  /**
   * 驗證 LINE ID Token
   * @param idToken 從前端接收到的 ID Token
   * @returns 驗證結果
   * @throws Error 如果驗證過程中發生錯誤
   */
  async verifyIDToken(idToken: string): Promise<TokenVerifyResponse> {
    const formData = new URLSearchParams();
    formData.append('id_token', idToken);
    formData.append('client_id', this.LINE_LOGIN_CLIENT_ID);

    const responseData = await firstValueFrom(
      this.httpService
        .post(this.LINE_LOGIN_VERIFY_URL, formData.toString(), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        .pipe(
          catchError((err: AxiosError) => {
            return throwError(
              () =>
                new Error(
                  `LINE token verify API request failed: ${JSON.stringify(err.response?.data)}`,
                ),
            );
          }),
        ),
    );

    return responseData.data;
  }
}

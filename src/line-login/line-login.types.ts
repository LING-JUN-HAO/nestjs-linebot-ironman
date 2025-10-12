export interface TokenVerifyResponse {
  /** Token 發行者 (固定為 https://access.line.me) - ID token 產生的 URL */
  iss: string;

  /** 使用者 ID - 產生 ID token 的使用者 ID */
  sub: string;

  /** Channel ID - 對應你的 LINE Login Channel */
  aud: string;

  /** Token 過期時間 - ID token 的過期時間 (UNIX timestamp) */
  exp: number;

  /** Token 發行時間 - ID token 產生的時間 (UNIX timestamp) */
  iat: number;

  /** 使用者認證時間 - 使用者被認證的時間 (UNIX timestamp)，若授權請求中未指定 max_age 參數則不包含 */
  auth_time?: number;

  /** 驗證請求中使用的 nonce 值 - 若授權 URL 中未指定 nonce 值則不包含 */
  nonce?: string;

  /**
   * 使用者使用的認證方法清單 - 在某些條件下不包含在 payload 中
   * 可能包含以下一個或多個值:
   * - pwd: 使用 email 和密碼登入
   * - lineautologin: LINE 自動登入 (包括透過 LINE SDK)
   * - lineqr: 使用 QR code 登入
   * - linesso: 使用單一登入 (single sign-on)
   * - mfa: 使用雙因素認證登入
   */
  amr?: string[];

  /** 使用者顯示名稱 - 若授權請求中未指定 profile scope 則不包含 */
  name?: string;

  /** 使用者頭像 URL - 若授權請求中未指定 profile scope 則不包含 */
  picture?: string;

  /** 使用者 email 地址 - 若授權請求中未指定 email scope 則不包含 */
  email?: string;
}

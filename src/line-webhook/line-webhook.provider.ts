import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// 註冊名稱
export const LINE_CONFIG = 'LINE_CONFIG';

// 註冊的常數(這邊讀取的是.env 環境變數裡面的內容)
const lineConfig = (configService: ConfigService) => ({
  channelAccessToken: configService.getOrThrow<string>(
    'line.channelAccessToken',
  ),
  channelSecret: configService.getOrThrow<string>('line.channelSecret'),
});

// 匯出成 NestJS Provider 供依賴注入系統使用(簡單來說就是 Nest 使用要用這種註冊方式)
export const LineConfigProvider: Provider = {
  provide: LINE_CONFIG,
  useFactory: (configService: ConfigService) => lineConfig(configService),
  inject: [ConfigService],
};

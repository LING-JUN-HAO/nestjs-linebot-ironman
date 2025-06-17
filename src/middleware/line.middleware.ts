import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { validateSignature } from '@line/bot-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LineMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const channelSecret = this.configService.get<string>('LINE_CHANNEL_SECRET');

    if (!channelSecret) {
      console.error('LINE_CHANNEL_SECRET 未設定');
      return res.status(500).send({ status: 'Server error' });
    }

    try {
      const signature = req.headers['x-line-signature'] as string;
      if (!signature) {
        console.error('缺少 X-Line-Signature header');
        return res.status(401).send({ status: 'Unauthorized' });
      }

      const bodyBuffer = req.body;

      // 用原始 Buffer 驗證簽名
      if (!validateSignature(bodyBuffer, channelSecret, signature)) {
        console.error('簽名驗證失敗');
        return res.status(401).send({ status: 'Unauthorized' });
      }

      // 簽名驗證通過後，把 Buffer 轉換回 JSON 物件
      req.body = JSON.parse(bodyBuffer.toString('utf8'));
      // 往下繼續到 Controller
      next();
    } catch (error) {
      console.error('LINE Middleware Error:', error);
      return res.status(401).send({ status: 'Unauthorized' });
    }
  }
}

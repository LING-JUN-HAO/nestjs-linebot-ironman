import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
  ClientConfig,
  WebhookRequestBody,
  messagingApi,
  MessageEvent,
  WebhookEvent,
} from '@line/bot-sdk';
import { LINE_CONFIG } from '../config/line.config';

type HandlerMap = {
  [K in WebhookEvent['type']]: (
    event: Extract<WebhookEvent, { type: K }>,
  ) => Promise<void>;
};

@Controller()
export class AppController {
  private readonly lineClient: messagingApi.MessagingApiClient;

  // 根據配置檔案初始化 LINE Messaging API 客戶端
  constructor(@Inject(LINE_CONFIG) private readonly lineConfig: ClientConfig) {
    this.lineClient = new messagingApi.MessagingApiClient({
      channelAccessToken: this.lineConfig.channelAccessToken,
    });
  }

  /**
   * Webhook 端點處理器
   * 接收來自 LINE Platform 的事件通知
   * @param body LINE Platform 傳送的 Webhook 請求本體
   * @returns 處理完成的回應訊息
   */
  @Post('/webhook')
  async handleWebhook(@Body() body: WebhookRequestBody): Promise<string> {
    console.log(
      'Webhook 從 line platform 接收到的資訊:',
      JSON.stringify(body, null, 2),
    );
    const { events } = body;

    // 事件處理器映射表
    const eventHandler = {
      message: (event) => this.handleMessageEvent(event),
    } satisfies Partial<HandlerMap>;

    // 逐項處理每一個事件
    for (const event of events) {
      const { type } = event;
      if (type === 'message') {
        await eventHandler[type](event);
      }
    }

    return 'Webhook processed successfully';
  }

  /**
   * 處理訊息事件
   * @param event 訊息事件物件，包含用戶訊息內容(text)和回覆憑證(replyToken)
   */
  private async handleMessageEvent(event: MessageEvent): Promise<void> {
    const { replyToken } = event;
    console.log('收到訊息事件', event);
    console.log('訊息憑證(身分證):', replyToken);
    await this.lineClient.replyMessage({
      replyToken,
      messages: [
        {
          type: 'text',
          text: 'hello world',
        },
      ],
    });
  }
}

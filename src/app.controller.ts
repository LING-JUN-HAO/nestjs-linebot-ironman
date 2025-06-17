import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
  ClientConfig,
  WebhookRequestBody,
  messagingApi,
  MessageEvent,
  WebhookEvent,
  FollowEvent,
  UnfollowEvent,
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
      follow: (event) => this.handleFollowEvent(event),
      unfollow: (event) => this.handleUnfollowEvent(event),
    } satisfies Partial<HandlerMap>;

    // 逐項處理每一個事件
    for (const event of events) {
      const { type } = event;
      const handler = eventHandler[type];
      if (handler) await handler(event);
    }

    return 'Webhook processed successfully';
  }

  /**
   * 用戶首次加入好友或解除封鎖官方帳號時觸發
   * @param event 加入好友事件
   */
  private async handleFollowEvent(event: FollowEvent): Promise<void> {
    const { replyToken } = event;
    await this.lineClient.replyMessage({
      replyToken,
      messages: [
        {
          type: 'text',
          text: '恭喜你加入我們的官方帳號！',
        },
      ],
    });
  }

  /**
   * 用戶封鎖或刪除官方帳號時觸發
   * @param event 取消好友事件
   */
  private async handleUnfollowEvent(event: UnfollowEvent): Promise<void> {
    // 這裡可以記錄用戶取消關注的事件
    console.log(`用戶 ${event.source.userId} 已取消關注官方帳號。`);
  }

  /**
   * 用戶發送任何類型的訊息時觸發
   * @param event 訊息事件
   */
  private async handleMessageEvent(event: MessageEvent): Promise<void> {
    const { replyToken } = event;
    await this.lineClient.replyMessage({
      replyToken,
      messages: [
        {
          type: 'text',
          text: '這是訊息事件！- 1',
        },
        {
          type: 'text',
          text: '這是訊息事件！- 2',
        },
        {
          type: 'text',
          text: '這是訊息事件！- 3',
        },
        {
          type: 'text',
          text: '這是訊息事件！- 4',
        },
        {
          type: 'text',
          text: '這是訊息事件！ - 5',
        },
      ],
    });
  }
}

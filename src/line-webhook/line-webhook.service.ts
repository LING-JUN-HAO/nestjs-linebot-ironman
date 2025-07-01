import {
  ClientConfig,
  FollowEvent,
  messagingApi,
  UnfollowEvent,
  MessageEvent,
  WebhookRequestBody,
} from '@line/bot-sdk';
import { Inject, Injectable } from '@nestjs/common';
import { LINE_CONFIG } from 'config/line.config';
import {
  MessageEventHandlerMap,
  WebhookEventHandlerMap,
} from './line-webhook.types';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class LineWebhookService {
  private readonly lineClient: messagingApi.MessagingApiClient;

  // 根據配置檔案初始化 LINE Messaging API 客戶端
  constructor(
    @Inject(LINE_CONFIG) private readonly lineConfig: ClientConfig,
    private readonly logger: PinoLogger,
  ) {
    this.lineClient = new messagingApi.MessagingApiClient({
      channelAccessToken: this.lineConfig.channelAccessToken,
    });
    this.logger.setContext(LineWebhookService.name);
  }

  /**
   * 處理來自 LINE Platform 的 Webhook 請求
   * @param body LINE Platform 傳送的 Webhook 請求本體
   */
  async processWebhook(body: WebhookRequestBody): Promise<string> {
    const { events } = body;
    this.logger.trace(JSON.stringify(events));

    const webhookEventHandlerMap = {
      message: (event) => this.handleMessageEvent(event),
      follow: (event) => this.handleFollowEvent(event),
      unfollow: (event) => this.handleUnfollowEvent(event),
    } satisfies Partial<WebhookEventHandlerMap>;

    for (const event of events) {
      const handler = webhookEventHandlerMap[event.type];
      if (handler) await handler(event);
    }

    return 'Webhook processed successfully';
  }

  /**
   * 用戶首次加入好友或解除封鎖官方帳號時觸發
   * @param event 加入好友事件
   */
  private async handleFollowEvent(event: FollowEvent): Promise<void> {
    await this.lineClient.replyMessage({
      replyToken: event.replyToken,
      messages: [{ type: 'text', text: '歡迎加入官方帳號！' }],
    });
  }

  /**
   * 用戶封鎖或刪除官方帳號時觸發
   * @param event 取消好友事件
   */
  private async handleUnfollowEvent(event: UnfollowEvent): Promise<void> {
    console.log(`使用者 ${event.source.userId} 取消關注`);
  }

  /**
   * 用戶發送任何類型的訊息時觸發
   * @param event 訊息事件
   */
  private async handleMessageEvent(event: MessageEvent): Promise<void> {
    const messageEventHandlerMap = {
      text: (message) => `📝 收到文字訊息：${message.text}`,
      sticker: (message) =>
        `🎭 收到貼圖訊息 => 貼圖包編號：${message.stickerId}-貼圖編號：${message.packageId}}`,
      image: (message) =>
        `🖼️ 收到圖片訊息 => 訊息編號：${message.id}-圖片來源：${message.contentProvider.type}`,
      video: (message) =>
        `🎬 收到影片訊息 => 訊息編號：${message.id}-影片來源：${message.contentProvider.type}`,
      audio: (message) =>
        `🎵 收到音檔訊息 => 訊息編號：${message.id}-時長：${message.duration} ms-音頻來源：${message.contentProvider.type}`,
      location: (message) =>
        `📍 收到位置訊息 => 地址：${message.address}-精度：${message.longitude}-緯度：${message.latitude}`,
    } satisfies Partial<MessageEventHandlerMap>;

    let replyMessage = '✨ 感謝你的訊息，我們已經收到了！';
    const handler = messageEventHandlerMap[event.message.type];
    if (handler) replyMessage = handler(event.message);

    await this.lineClient.replyMessage({
      replyToken: event.replyToken,
      messages: [{ type: 'text', text: replyMessage }],
    });
  }
}

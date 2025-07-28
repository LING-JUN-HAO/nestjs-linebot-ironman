import {
  ClientConfig,
  FollowEvent,
  messagingApi,
  UnfollowEvent,
  MessageEvent,
  WebhookRequestBody,
} from '@line/bot-sdk';
import { Inject, Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { LINE_CONFIG } from 'src/line-webhook/line-webhook.provider';
import { WeatherService } from 'src/weather/weather.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { LineMessageService } from 'src/line-message/line-message.service';
import {
  MessageEventHandlerMap,
  WebhookEventHandlerMap,
} from './line-webhook.types';

@Injectable()
export class LineWebhookService {
  private readonly lineClient: messagingApi.MessagingApiClient;
  private readonly blobClient: messagingApi.MessagingApiBlobClient;

  // 根據配置檔案初始化 LINE Messaging API 客戶端
  constructor(
    @Inject(LINE_CONFIG) private readonly lineConfig: ClientConfig,
    private readonly logger: PinoLogger,
    private readonly weatherService: WeatherService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly lineMessageService: LineMessageService,
  ) {
    this.lineClient = new messagingApi.MessagingApiClient({
      channelAccessToken: this.lineConfig.channelAccessToken,
    });
    this.blobClient = new messagingApi.MessagingApiBlobClient({
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
      text: (message) =>
        this.lineMessageService.createTextMessage({
          text: message.text,
          emoji: {
            index: 0,
            productId: '5ac21c4e031a6752fb806d5b',
            emojiId: '006',
          },
        }),
      sticker: () =>
        this.lineMessageService.createStickerMessage({
          packageId: '6359',
          stickerId: '11069851',
        }),
      image: () =>
        this.lineMessageService.createImageMessage({
          previewImageUrl:
            'https://res.cloudinary.com/dseg0uwc9/image/upload/v1752220509/2025%20IT%20%E9%90%B5%E4%BA%BA%E8%B3%BD/569400594147311960.jpg',
          originalContentUrl:
            'https://res.cloudinary.com/dseg0uwc9/image/upload/v1752220509/2025%20IT%20%E9%90%B5%E4%BA%BA%E8%B3%BD/569400594147311960.jpg',
        }),
      video: () =>
        this.lineMessageService.createVideoMessage({
          previewImageUrl:
            'https://res.cloudinary.com/dseg0uwc9/image/upload/e_improve,w_300,h_600,c_thumb,g_auto/v1752220479/2025%20IT%20%E9%90%B5%E4%BA%BA%E8%B3%BD/569400541533438471.jpg',
          originalContentUrl:
            'https://res.cloudinary.com/dseg0uwc9/video/upload/v1753430100/test_video_fyraxr.mp4',
        }),
      audio: () =>
        this.lineMessageService.createAudioMessage({
          originalContentUrl:
            'https://res.cloudinary.com/dseg0uwc9/video/upload/v1740070405/%E9%90%B5%E4%BA%BA%E8%B3%BD%E8%A6%81%E5%A4%9A%E4%B9%85_pgkjr2.m4a',
          duration: 11000,
        }),
      location: () =>
        this.lineMessageService.createLocationMessage({
          title: '東海小確幸黑糖鮮奶波霸（東海總店）',
          address: '434台中市龍井區台灣大道五段3巷66號',
          latitude: 24.1815183,
          longitude: 120.5899484,
        }),
    } satisfies Partial<MessageEventHandlerMap>;

    let replyMessage;
    const handler = messageEventHandlerMap[event.message.type];
    if (handler) replyMessage = handler(event.message);

    await this.lineClient.replyMessage({
      replyToken: event.replyToken,
      messages: [replyMessage],
    });
  }
}

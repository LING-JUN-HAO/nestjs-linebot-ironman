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
          sender: {
            name: '狗狗助理 v2',
            iconUrl:
              'https://res.cloudinary.com/dseg0uwc9/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1753953684/2025%20IT%20%E9%90%B5%E4%BA%BA%E8%B3%BD/dog_icon_grxcsl.jpg',
          },
          quickReplyItems: [
            {
              imageUrl:
                'https://res.cloudinary.com/dseg0uwc9/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1753953684/2025%20IT%20%E9%90%B5%E4%BA%BA%E8%B3%BD/dog_icon_grxcsl.jpg',
              action: {
                type: 'message',
                label: '天氣',
                text: '天氣',
              },
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dseg0uwc9/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1753953684/2025%20IT%20%E9%90%B5%E4%BA%BA%E8%B3%BD/dog_icon_grxcsl.jpg',
              action: {
                type: 'message',
                label: '天氣2',
                text: '天氣2',
              },
            },
            {
              imageUrl:
                'https://res.cloudinary.com/dseg0uwc9/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1753953684/2025%20IT%20%E9%90%B5%E4%BA%BA%E8%B3%BD/dog_icon_grxcsl.jpg',
              action: {
                type: 'message',
                label: '天氣3',
                text: '天氣3',
              },
            },
          ],
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
            'https://res.cloudinary.com/dseg0uwc9/image/upload/v1758793097/2025%20IT%20%E9%90%B5%E4%BA%BA%E8%B3%BD/Day%2012%EF%BC%9ALINE%20Bot%20%E5%AA%92%E9%AB%94%E8%A8%8A%E6%81%AF%E8%99%95%E7%90%86%E8%88%87%E4%BA%92%E5%8B%95%E9%AB%94%E9%A9%97%E5%84%AA%E5%8C%96%20-%20Sender%20%E5%AE%A2%E8%A3%BD%E5%8C%96%E5%8F%8A%20Quick%20Reply/LINE_%E6%B0%B4%E5%A3%BA%E9%A0%90%E8%A6%BD%E5%9C%96%E7%89%87_ahy1wu.jpg',
          originalContentUrl:
            'https://res.cloudinary.com/dseg0uwc9/video/upload/v1758792999/2025%20IT%20%E9%90%B5%E4%BA%BA%E8%B3%BD/Day%2012%EF%BC%9ALINE%20Bot%20%E5%AA%92%E9%AB%94%E8%A8%8A%E6%81%AF%E8%99%95%E7%90%86%E8%88%87%E4%BA%92%E5%8B%95%E9%AB%94%E9%A9%97%E5%84%AA%E5%8C%96%20-%20Sender%20%E5%AE%A2%E8%A3%BD%E5%8C%96%E5%8F%8A%20Quick%20Reply/%E6%B8%AC%E8%A9%A6%E6%B0%B4%E5%A3%BA%E5%BD%B1%E7%89%87_fl70s9.mp4',
        }),
      audio: () =>
        this.lineMessageService.createAudioMessage({
          originalContentUrl:
            'https://res.cloudinary.com/dseg0uwc9/video/upload/v1758793412/2025%20IT%20%E9%90%B5%E4%BA%BA%E8%B3%BD/Day%2012%EF%BC%9ALINE%20Bot%20%E5%AA%92%E9%AB%94%E8%A8%8A%E6%81%AF%E8%99%95%E7%90%86%E8%88%87%E4%BA%92%E5%8B%95%E9%AB%94%E9%A9%97%E5%84%AA%E5%8C%96%20-%20Sender%20%E5%AE%A2%E8%A3%BD%E5%8C%96%E5%8F%8A%20Quick%20Reply/%E6%B8%AC%E8%A9%A6%E9%8C%84%E9%9F%B3_rdozer.mp4',
          duration: 1000,
        }),
      location: () =>
        this.lineMessageService.createLocationMessage({
          title: '臺中都會公園',
          address: '407台中市西屯區都會園路1215巷140號',
          latitude: 24.208202556409745,
          longitude: 120.5978843115818,
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

import {
  ClientConfig,
  FollowEvent,
  messagingApi,
  UnfollowEvent,
  MessageEvent,
  WebhookRequestBody,
  EventMessage,
} from '@line/bot-sdk';
import { Message } from '@line/bot-sdk/lib/messaging-api/model/message';
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
      text: (message) => {
        const { text } = message;
        if (text === 'button') {
          return this.lineMessageService.createTemplateButtonMessage({
            altText: '按鈕小精靈通知',
            thumbnailImageUrl:
              'https://res.cloudinary.com/dseg0uwc9/image/upload/v1753953684/2025%20IT%20%E9%90%B5%E4%BA%BA%E8%B3%BD/dog_icon_grxcsl.jpg',
            title: '標題',
            text: '按鈕小精靈出來吧',
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
            actions: [
              {
                type: 'message',
                label: '我是按鈕 1',
                text: '我是按鈕 1 號',
              },
              {
                type: 'message',
                label: '我是按鈕 2',
                text: '我是按鈕 2 號',
              },
              {
                type: 'message',
                label: '我是按鈕 3',
                text: '我是按鈕 3 號',
              },
              {
                type: 'message',
                label: '我是按鈕～',
                text: '我是按鈕 4 號',
              },
            ],
          });
        }
        if (text === 'confirm') {
          return this.lineMessageService.createTemplateConfirmMessage({
            altText: '確認通知訊息！',
            text: '你確定要這樣做嗎？',
            actions: [
              {
                type: 'message',
                label: '是',
                text: '是的，我確定',
              },
              {
                type: 'message',
                label: '否',
                text: '不是，我不要',
              },
            ],
          });
        }
        if (text === 'carousel') {
          return this.lineMessageService.createTemplateCarouselMessage<1>({
            altText: '最新活動消息！！',
            cards: [
              {
                text: '新生代狗狗寵物展',
                thumbnailImageUrl:
                  'https://res.cloudinary.com/dseg0uwc9/image/upload/v1753953684/2025%20IT%20%E9%90%B5%E4%BA%BA%E8%B3%BD/dog_icon_grxcsl.jpg',
                actions: [
                  {
                    type: 'message',
                    label: '搶先第一手資訊',
                    text: '可愛狗狗展',
                  },
                ],
              },
              {
                text: '可愛貓貓展',
                thumbnailImageUrl:
                  'https://res.cloudinary.com/dseg0uwc9/image/upload/v1753953684/2025%20IT%20%E9%90%B5%E4%BA%BA%E8%B3%BD/dog_icon_grxcsl.jpg',
                actions: [
                  {
                    type: 'message',
                    label: '搶先第一手資訊',
                    text: '可愛貓貓展',
                  },
                ],
              },
            ],
          });
        }
        if (text === 'imageCarousel') {
          return this.lineMessageService.createTemplateImageCarouselMessage({
            altText: '最新產品消息',
            cards: [
              {
                imageUrl:
                  'https://res.cloudinary.com/dseg0uwc9/image/upload/v1753953684/2025%20IT%20%E9%90%B5%E4%BA%BA%E8%B3%BD/dog_icon_grxcsl.jpg',
                action: {
                  type: 'message',
                  label: '狗狗商品 1 號',
                  text: '狗狗商品 1 號',
                },
              },
              {
                imageUrl:
                  'https://res.cloudinary.com/dseg0uwc9/image/upload/v1753953684/2025%20IT%20%E9%90%B5%E4%BA%BA%E8%B3%BD/dog_icon_grxcsl.jpg',
                action: {
                  type: 'message',
                  label: '狗狗商品 2 號',
                  text: '狗狗商品 2 號',
                },
              },
            ],
          });
        }
        if (text === 'imageMap') {
          return this.lineMessageService.createImageMapMessage({
            baseUrl:
              'https://linebot-imagemap.qd513020.workers.dev/Line_ImageMap_Message_video_%E8%A8%AD%E8%A8%88_g4oh3d/png',
            altText: '背單字提醒！',
            video: {
              previewImageUrl:
                'https://linebot-imagemap.qd513020.workers.dev/Line_ImageMap_Message_video_%E8%A8%AD%E8%A8%88_g4oh3d/png/1040',
              originalContentUrl:
                'https://res.cloudinary.com/dseg0uwc9/video/upload/v1753430100/test_video_fyraxr.mp4',
              area: {
                x: 0,
                y: 0,
                width: 1040,
                height: 1040,
              },
              externalLink: {
                label: '點我領取相關資訊',
                linkUri: 'https://google.com.tw/',
              },
            },
            actions: [
              {
                type: 'message',
                area: {
                  x: 0,
                  y: 0,
                  width: 1040,
                  height: 1040,
                },
                text: '請至行動裝置上查看影片內容！',
              },
            ],
          });
        }
        return this.lineMessageService.createTextMessage({
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
        });
      },
      sticker: () =>
        this.lineMessageService.createStickerMessage({
          packageId: '6370',
          stickerId: '11088018',
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
    } satisfies Partial<MessageEventHandlerMap>; // 這部分主要是因為目前沒有處理 file 事件

    const handler: (message: EventMessage) => Message =
      messageEventHandlerMap[event.message.type];

    const replyMessage = handler(event.message);

    await this.lineClient.replyMessage({
      replyToken: event.replyToken,
      messages: [replyMessage],
    });
  }
}

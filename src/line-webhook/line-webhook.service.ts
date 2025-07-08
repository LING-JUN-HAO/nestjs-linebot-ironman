import {
  ClientConfig,
  FollowEvent,
  messagingApi,
  UnfollowEvent,
  MessageEvent,
  WebhookRequestBody,
} from '@line/bot-sdk';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LINE_CONFIG } from 'config/line.config';
import {
  CurrentWeatherResponse,
  MessageEventHandlerMap,
  WebhookEventHandlerMap,
} from './line-webhook.types';
import { PinoLogger } from 'nestjs-pino';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class LineWebhookService {
  private readonly lineClient: messagingApi.MessagingApiClient;
  private readonly WEATHER_API_BASE_URL: string;
  private readonly WEATHER_API_KEY: string;

  // 根據配置檔案初始化 LINE Messaging API 客戶端
  constructor(
    @Inject(LINE_CONFIG) private readonly lineConfig: ClientConfig,
    private readonly httpService: HttpService,
    private readonly logger: PinoLogger,
    private readonly configService: ConfigService,
  ) {
    this.lineClient = new messagingApi.MessagingApiClient({
      channelAccessToken: this.lineConfig.channelAccessToken,
    });
    this.WEATHER_API_BASE_URL =
      this.configService.getOrThrow<string>('weather.baseUrl');
    this.WEATHER_API_KEY =
      this.configService.getOrThrow<string>('weather.apiKey');
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
      text: async (message) => `📝 收到文字訊息：${message.text}`,
      sticker: async (message) =>
        `🎭 收到貼圖訊息 => 貼圖包編號：${message.stickerId}-貼圖編號：${message.packageId}}`,
      image: async (message) =>
        `🖼️ 收到圖片訊息 => 訊息編號：${message.id}-圖片來源：${message.contentProvider.type}`,
      video: async (message) =>
        `🎬 收到影片訊息 => 訊息編號：${message.id}-影片來源：${message.contentProvider.type}`,
      audio: async (message) =>
        `🎵 收到音檔訊息 => 訊息編號：${message.id}-時長：${message.duration} ms-音頻來源：${message.contentProvider.type}`,
      location: async (message) => {
        const { address, longitude, latitude } = message;
        const defaultMsg = `📍 收到位置訊息\n🏠 地址：${address}\n🧭 精度：${longitude}\n🧭 緯度：${latitude}`;

        const weatherData: CurrentWeatherResponse =
          await this.#fetchWeatherData(latitude, longitude);
        const weatherInfoText = this.#formateWeatherInfo(weatherData);

        return `${defaultMsg}\n\n${weatherInfoText}`;
      },
    } satisfies Partial<MessageEventHandlerMap>;

    let replyMessage = '✨ 感謝你的訊息，我們已經收到了！';
    const handler = messageEventHandlerMap[event.message.type];
    if (handler) replyMessage = await handler(event.message);

    await this.lineClient.replyMessage({
      replyToken: event.replyToken,
      messages: [{ type: 'text', text: replyMessage }],
    });
  }

  /**
   * 根據用戶發送的地理位置查詢天氣資訊
   * @param latitude 緯度
   * @param longitude 經度
   */
  async #fetchWeatherData(latitude: number, longitude: number) {
    // 查詢參數
    const queryParams = {
      lat: latitude,
      lon: longitude,
      appid: this.WEATHER_API_KEY,
      units: 'metric',
      lang: 'zh_tw',
    };

    // 接收處理完的天氣數據
    const responseData = await firstValueFrom(
      this.httpService
        .get(this.WEATHER_API_BASE_URL, { params: queryParams })
        .pipe(
          catchError((err: AxiosError) => {
            return throwError(
              () =>
                new Error(
                  `Weather API request failed: ${JSON.stringify(err.response?.data)}`,
                ),
            );
          }),
        ),
    );

    return responseData.data;
  }

  /**
   * 將天氣數據格式化為易讀的文字資訊
   * @param weatherData 從天氣 API 獲取的天氣數據
   * @returns  格式化的天氣資訊
   */
  #formateWeatherInfo(weatherData: CurrentWeatherResponse) {
    const locationName = weatherData.name || '該區域';
    const temp = weatherData.main.temp;
    const feelsLike = weatherData.main.feels_like;
    const humidity = weatherData.main.humidity;
    const description = weatherData.weather[0]?.description || '未知天氣狀況';

    return `🌤️ ${locationName} 的天氣：\n🌡️ 溫度：${temp}°C (體感：${feelsLike}°C)\n💧 濕度：${humidity}%\n☁️ 狀況：${description}`;
  }
}

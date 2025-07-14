import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { CurrentWeatherResponse } from './weather.types';

@Injectable()
export class WeatherService {
  private readonly WEATHER_API_BASE_URL: string;
  private readonly WEATHER_API_KEY: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.WEATHER_API_BASE_URL =
      this.configService.getOrThrow<string>('weather.baseUrl');
    this.WEATHER_API_KEY =
      this.configService.getOrThrow<string>('weather.apiKey');
  }

  /**
   * 根據用戶發送的地理位置查詢天氣資訊
   * @param latitude 緯度
   * @param longitude 經度
   */
  async getWeatherByCoordinates(latitude: number, longitude: number) {
    if (!latitude || !longitude) {
      throw new HttpException('請提供緯度和經度', HttpStatus.BAD_REQUEST);
    }

    // 查詢參數
    const queryParams = {
      lat: latitude,
      lon: longitude,
      appid: this.WEATHER_API_KEY,
      units: 'metric',
      lang: 'zh_tw',
    };

    try {
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
      return this.#formateWeatherInfo(responseData.data);
    } catch (error) {
      throw error;
    }
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

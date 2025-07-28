import { Injectable } from '@nestjs/common';
import {
  TextMessage,
  StickerMessage,
  ImageMessage,
  VideoMessage,
  AudioMessage,
  LocationMessage,
} from '@line/bot-sdk';
import { MessageType } from './types/enum';
import {
  TextMessageReq,
  StickerMessageReq,
  ImageMessageReq,
  VideoMessageReq,
  AudioMessageReq,
  LocationMessageReq,
} from './types';

@Injectable()
export class LineMessageService {
  /**
   * 發送文字訊息
   * 詳細的 Emoji 可以使用的 ID 可以參照：{@link https://developers.line.biz/en/docs/messaging-api/emoji-list/#line-emoji-definitions}
   *
   * @param {TextMessageReq} textMessageReq - 文字訊息請求對象
   * @param {string} textMessageReq.text - 要發送的文字內容
   * @param textMessageReq.emoji - 可選的表情符號配置
   * @param {number} textMessageReq.emoji.index - 表情符號要插入的位置
   * @param {string} textMessageReq.emoji.productId - 表情符號系列 ID，例如 '5ac1bf65040ab15980c9b435'
   * @param {string} textMessageReq.emoji.emojiId - 表情符號 ID，例如 '001'
   * @see https://developers.line.biz/en/reference/messaging-api/#text-message
   */
  createTextMessage(textMessageReq: TextMessageReq): TextMessage {
    const { text, emoji } = textMessageReq;

    let modifiedText = text;

    // 處理 emoji 替換位置的問題
    if (emoji) {
      const emojiIndex = emoji.index;
      const placeholderChar = '~';
      const textArr = Array.from(text.padStart(emojiIndex, placeholderChar));
      textArr.splice(emojiIndex, 0, '$ ');
      modifiedText = textArr.join('');
    }

    const textMessage: TextMessage = {
      type: MessageType.Text,
      text: modifiedText,
      ...(emoji && {
        emojis: [
          {
            index: emoji.index,
            productId: emoji.productId,
            emojiId: emoji.emojiId,
          },
        ],
      }),
    };

    return textMessage;
  }

  /**
   * 發送貼圖訊息
   * 詳細的貼圖可以使用的 ID 可以參照：{@link https://developers.line.biz/en/docs/messaging-api/sticker-list/#sticker-definitions}
   *
   * @param {StickerMessageReq} stickerMessageReq - 貼圖訊息請求對象
   * @param {string} stickerMessageReq.packageId - 貼圖包 ID，例如 '446'
   * @param {string} stickerMessageReq.stickerId - 貼圖 ID，例如 '1988'
   * @see https://developers.line.biz/en/reference/messaging-api/#sticker-message
   */
  createStickerMessage(stickerMessageReq: StickerMessageReq): StickerMessage {
    const { packageId, stickerId } = stickerMessageReq;

    const stickerMessage: StickerMessage = {
      type: MessageType.Sticker,
      packageId,
      stickerId,
    };

    return stickerMessage;
  }

  /**
   * 發送圖片訊息
   * originalContentUrl 與 previewImageUrl 必須 使用 HTTPS 協議開頭，確保安全連線
   *
   * @param {ImageMessageReq} imageMessageReq - 圖片訊息請求對象
   * @param {string} imageMessageReq.originalContentUrl - 原始圖片的 HTTPS URL
   * @param {string} imageMessageReq.previewImageUrl - 預覽圖片的 HTTPS URL
   * @see https://developers.line.biz/en/reference/messaging-api/#image-message
   */
  createImageMessage(imageMessageReq: ImageMessageReq): ImageMessage {
    const { originalContentUrl, previewImageUrl } = imageMessageReq;

    const imageMessage: ImageMessage = {
      type: MessageType.Image,
      originalContentUrl,
      previewImageUrl,
    };

    return imageMessage;
  }

  /**
   * 發送影片訊息
   *
   * @param {VideoMessageReq} videoMessageReq - 影片訊息請求物件
   * @param {string} videoMessageReq.originalContentUrl - 原始影片的 HTTPS URL(必須是 MP4 檔案)
   * @param {string} videoMessageReq.previewImageUrl - 預覽影片的 HTTPS URL(必須是 JPEG/PNG 圖片)
   * @see https://developers.line.biz/en/reference/messaging-api/#video-message
   */
  createVideoMessage(videoMessageReq: VideoMessageReq): VideoMessage {
    const { originalContentUrl, previewImageUrl } = videoMessageReq;

    const videoMessage: VideoMessage = {
      type: MessageType.Video,
      originalContentUrl,
      previewImageUrl,
    };

    return videoMessage;
  }

  /**
   * 發送音訊訊息
   *
   * @param {AudioMessageReq} audioMessageReq - 音訊訊息請求物件
   * @param {string} audioMessageReq.originalContentUrl - 原始音訊的 HTTPS URL
   * @param {number} [audioMessageReq.duration=11000] - 音訊長度(ms)
   * @see https://developers.line.biz/en/reference/messaging-api/#audio-message
   */
  createAudioMessage(audioMessageReq: AudioMessageReq): AudioMessage {
    const { originalContentUrl, duration } = audioMessageReq;

    const audioMessage: AudioMessage = {
      type: MessageType.Audio,
      originalContentUrl,
      duration,
    };

    return audioMessage;
  }

  /**
   * 發送地理位置訊息
   *
   * @param {LocationMessageReq} locationMessageReq - 地理位置訊息請求物件
   * @param {string} locationMessageReq.title - 位置名稱（如地標、店家名稱）
   * @param {string} locationMessageReq.address - 地址文字（如門牌或街道）
   * @param {number} locationMessageReq.latitude - 緯度，將自動限制在 -90 ～ 90
   * @param {number} locationMessageReq.longitude - 經度，將自動限制在 -180 ～ 180
   * @see https://developers.line.biz/en/reference/messaging-api/#location-message
   */
  createLocationMessage(
    locationMessageReq: LocationMessageReq,
  ): LocationMessage {
    const { title, address, latitude, longitude } = locationMessageReq;

    // 經緯度有效區間判斷
    const minLatitude = -90;
    const maxLatitude = 90;
    const minLongitude = -180;
    const maxLongitude = 180;

    const locationMessage: LocationMessage = {
      type: MessageType.Location,
      title,
      address,
      latitude: Math.max(Math.min(latitude, maxLatitude), minLatitude),
      longitude: Math.max(Math.min(longitude, maxLongitude), minLongitude),
    };

    return locationMessage;
  }
}

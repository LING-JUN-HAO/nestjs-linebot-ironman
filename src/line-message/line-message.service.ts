import { Injectable } from '@nestjs/common';
import {
  TextMessage,
  StickerMessage,
  ImageMessage,
  VideoMessage,
  AudioMessage,
  LocationMessage,
  TemplateMessage,
  Sender,
  QuickReplyItem,
  ImageMapMessage,
} from '@line/bot-sdk';
import { MessageType } from './types/enum';
import {
  TextMessageReq,
  StickerMessageReq,
  ImageMessageReq,
  VideoMessageReq,
  AudioMessageReq,
  LocationMessageReq,
  TemplateButtonMessageReq,
  CommonMessageProps,
  TemplateConfirmMessageReq,
  TemplateCarouselMessageReq,
  TemplateImageCarouselMessageReq,
  ImageMapMessageReq,
} from './types';

@Injectable()
export class LineMessageService {
  /**
   * 建立通用的訊息屬性（sender 和 quickReply）
   *
   * @private
   * @param {Sender} sender - 可選的官方帳號發送資訊，可自訂發送者顯示
   * @param {string} sender.name - 官方帳號名稱，最長 20 字元
   * @param {string} [sender.iconUrl] - 官方帳號頭像圖片 URL
   * @param {Omit<QuickReplyItem, 'type'>[]} quickReplyItems - 可選的快速回覆按鈕陣列
   * @param {string} [quickReplyItems[].imageUrl] - 快速回覆按鈕的圖片 URL
   * @param {Action} quickReplyItems[].action - 快速回覆按鈕的動作設定
   * @returns {CommonMessageProps} 包含 sender 或 quickReply 屬性的物件
   */
  private buildCommonMessageProps(
    sender: Sender,
    quickReplyItems: Omit<QuickReplyItem, 'type'>[],
  ): CommonMessageProps {
    return {
      ...(sender && { sender }),
      ...(quickReplyItems && {
        quickReply: {
          items: quickReplyItems.map((quickReplyItem) => ({
            type: 'action' as const,
            ...quickReplyItem,
          })),
        },
      }),
    };
  }

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
   * @param textMessageReq.sender - 可選的官方帳號發送資訊，可自訂發送者顯示
   * @param textMessageReq.quickReplyItems - 可選的快速回覆按鈕
   * @see https://developers.line.biz/en/reference/messaging-api/#text-message
   */
  createTextMessage(textMessageReq: TextMessageReq): TextMessage {
    const { text, emoji, sender, quickReplyItems } = textMessageReq;

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
      ...this.buildCommonMessageProps(sender, quickReplyItems),
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
   * @param stickerMessageReq.sender - 可選的官方帳號發送資訊，可自訂發送者顯示
   * @param stickerMessageReq.quickReplyItems - 可選的快速回覆按鈕
   * @see https://developers.line.biz/en/reference/messaging-api/#sticker-message
   */
  createStickerMessage(stickerMessageReq: StickerMessageReq): StickerMessage {
    const { packageId, stickerId, sender, quickReplyItems } = stickerMessageReq;

    const stickerMessage: StickerMessage = {
      type: MessageType.Sticker,
      packageId,
      stickerId,
      ...this.buildCommonMessageProps(sender, quickReplyItems),
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
   * @param imageMessageReq.sender - 可選的官方帳號發送資訊，可自訂發送者顯示
   * @param {string} imageMessageReq.sender.name - 官方帳號名稱，最長 20 字元
   * @param {string} [imageMessageReq.sender.iconUrl] - 官方帳號頭像圖片 URL
   * @param imageMessageReq.sender - 可選的官方帳號發送資訊，可自訂發送者顯示
   * @param imageMessageReq.quickReplyItems - 可選的快速回覆按鈕
   * @see https://developers.line.biz/en/reference/messaging-api/#image-message
   */
  createImageMessage(imageMessageReq: ImageMessageReq): ImageMessage {
    const { originalContentUrl, previewImageUrl, sender, quickReplyItems } =
      imageMessageReq;

    const imageMessage: ImageMessage = {
      type: MessageType.Image,
      originalContentUrl,
      previewImageUrl,
      ...this.buildCommonMessageProps(sender, quickReplyItems),
    };

    return imageMessage;
  }

  /**
   * 發送影片訊息
   *
   * @param {VideoMessageReq} videoMessageReq - 影片訊息請求物件
   * @param {string} videoMessageReq.originalContentUrl - 原始影片的 HTTPS URL(必須是 MP4 檔案)
   * @param {string} videoMessageReq.previewImageUrl - 預覽影片的 HTTPS URL(必須是 JPEG/PNG 圖片)
   * @param videoMessageReq.sender - 可選的官方帳號發送資訊，可自訂發送者顯示
   * @param videoMessageReq.quickReplyItems - 可選的快速回覆按鈕
   * @see https://developers.line.biz/en/reference/messaging-api/#video-message
   */
  createVideoMessage(videoMessageReq: VideoMessageReq): VideoMessage {
    const { originalContentUrl, previewImageUrl, sender, quickReplyItems } =
      videoMessageReq;

    const videoMessage: VideoMessage = {
      type: MessageType.Video,
      originalContentUrl,
      previewImageUrl,
      ...this.buildCommonMessageProps(sender, quickReplyItems),
    };

    return videoMessage;
  }

  /**
   * 發送音訊訊息
   *
   * @param {AudioMessageReq} audioMessageReq - 音訊訊息請求物件
   * @param {string} audioMessageReq.originalContentUrl - 原始音訊的 HTTPS URL
   * @param {number} [audioMessageReq.duration=11000] - 音訊長度(ms)
   * @param audioMessageReq.sender - 可選的官方帳號發送資訊，可自訂發送者顯示
   * @param audioMessageReq.quickReplyItems - 可選的快速回覆按鈕
   * @see https://developers.line.biz/en/reference/messaging-api/#audio-message
   */
  createAudioMessage(audioMessageReq: AudioMessageReq): AudioMessage {
    const { originalContentUrl, duration, sender, quickReplyItems } =
      audioMessageReq;

    const audioMessage: AudioMessage = {
      type: MessageType.Audio,
      originalContentUrl,
      duration,
      ...this.buildCommonMessageProps(sender, quickReplyItems),
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
   * @param locationMessageReq.sender - 可選的官方帳號發送資訊，可自訂發送者顯示
   * @param locationMessageReq.quickReplyItems - 可選的快速回覆按鈕
   * @see https://developers.line.biz/en/reference/messaging-api/#location-message
   */
  createLocationMessage(
    locationMessageReq: LocationMessageReq,
  ): LocationMessage {
    const { title, address, latitude, longitude, sender, quickReplyItems } =
      locationMessageReq;

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
      ...this.buildCommonMessageProps(sender, quickReplyItems),
    };

    return locationMessage;
  }

  /**
   * 發送按鈕模板訊息
   *
   * @param {TemplateButtonMessageReq} templateButtonMessageReq - 按鈕模板訊息請求物件
   * @param {string} templateButtonMessageReq.altText - 替代文字，當訊息無法顯示時使用
   * @param {string} templateButtonMessageReq.text - 模板內容文字
   * @param {Action[]} templateButtonMessageReq.actions - 按鈕動作陣列，1-4個按鈕
   * @param {string} [templateButtonMessageReq.thumbnailImageUrl] - 可選的縮圖 HTTPS URL
   * @param {string} [templateButtonMessageReq.title] - 可選的模板標題
   * @param templateButtonMessageReq.sender - 可選的官方帳號發送資訊，可自訂發送者顯示
   * @param templateButtonMessageReq.quickReplyItems - 可選的快速回覆按鈕
   * @see https://developers.line.biz/en/reference/messaging-api/#buttons
   */
  createTemplateButtonMessage(
    templateButtonMessageReq: TemplateButtonMessageReq,
  ): TemplateMessage {
    const {
      altText,
      text,
      actions,
      thumbnailImageUrl,
      title,
      sender,
      quickReplyItems,
    } = templateButtonMessageReq;

    const templateButtonMessage: TemplateMessage = {
      type: MessageType.Template,
      altText,
      template: {
        type: MessageType.TemplateButton,
        text,
        actions,
        title,
        ...(thumbnailImageUrl && { thumbnailImageUrl }),
      },
      ...this.buildCommonMessageProps(sender, quickReplyItems),
    };

    return templateButtonMessage;
  }

  /**
   * 發送確認模板訊息（包含兩個選擇按鈕）
   *
   * @param {TemplateConfirmMessageReq} templateConfirmMessageReq - 確認模板訊息請求物件
   * @param {string} templateConfirmMessageReq.altText - 替代文字，當訊息無法顯示時使用
   * @param {string} templateConfirmMessageReq.text - 模板內容文字
   * @param {[Action, Action]} templateConfirmMessageReq.actions - 按鈕動作陣列，固定2個按鈕
   * @param templateConfirmMessageReq.sender - 可選的官方帳號發送資訊，可自訂發送者顯示
   * @param templateConfirmMessageReq.quickReplyItems - 可選的快速回覆按鈕
   * @see https://developers.line.biz/en/reference/messaging-api/#confirm
   */
  createTemplateConfirmMessage(
    templateConfirmMessageReq: TemplateConfirmMessageReq,
  ): TemplateMessage {
    const { altText, text, actions, sender, quickReplyItems } =
      templateConfirmMessageReq;

    const templateConfirmMessage: TemplateMessage = {
      type: MessageType.Template,
      altText,
      template: {
        type: MessageType.TemplateConfirm,
        text,
        actions,
      },
      ...this.buildCommonMessageProps(sender, quickReplyItems),
    };

    return templateConfirmMessage;
  }

  /**
   * 發送輪播模板訊息（包含多張卡片的橫向滑動訊息）
   *
   * @template N - 每張卡片的按鈕數量，用於型別檢查確保所有卡片按鈕數量一致
   * @param {TemplateCarouselMessageReq<N>} templateCarouselMessageReq - 輪播模板訊息請求物件
   * @param {string} templateCarouselMessageReq.altText - 替代文字，當訊息無法顯示時使用
   * @param {LimitedActionColumn<N>[]} templateCarouselMessageReq.cards - 卡片陣列，最多10張，每張卡片按鈕數量必須相同
   * @param {string} templateCarouselMessageReq.cards[].text - 卡片內容文字（必填）
   * @param {Action[]} templateCarouselMessageReq.cards[].actions - 卡片按鈕陣列（必填，最多3個）
   * @param {string} [templateCarouselMessageReq.cards[].title] - 可選的卡片標題
   * @param {string} [templateCarouselMessageReq.cards[].thumbnailImageUrl] - 可選的卡片縮圖 HTTPS URL
   * @param templateCarouselMessageReq.sender - 可選的官方帳號發送資訊，可自訂發送者顯示
   * @param templateCarouselMessageReq.quickReplyItems - 可選的快速回覆按鈕
   * @see https://developers.line.biz/en/reference/messaging-api/#carousel
   */
  createTemplateCarouselMessage<N extends number>(
    templateCarouselMessageReq: TemplateCarouselMessageReq<N>,
  ): TemplateMessage {
    const { altText, cards, sender, quickReplyItems } =
      templateCarouselMessageReq;

    const templateCarouselMessage: TemplateMessage = {
      type: MessageType.Template,
      altText,
      template: {
        type: MessageType.TemplateCarousel,
        columns: [...cards],
      },
      ...this.buildCommonMessageProps(sender, quickReplyItems),
    };

    return templateCarouselMessage;
  }

  /**
   * 發送圖片輪播模板訊息（包含多張圖片卡片的橫向滑動訊息）
   *
   * @param {TemplateImageCarouselMessageReq} templateImageCarouselMessageReq - 圖片輪播模板訊息請求物件
   * @param {string} templateImageCarouselMessageReq.altText - 替代文字，當訊息無法顯示時使用
   * @param {ImageCarouselColumn[]} templateImageCarouselMessageReq.cards - 圖片卡片陣列，最多10張
   * @param {string} templateImageCarouselMessageReq.cards[].imageUrl - 卡片圖片的 HTTPS URL（必填）
   * @param {Action} templateImageCarouselMessageReq.cards[].action - 點擊卡片時的動作（必填，僅支援1個動作）
   * @param templateImageCarouselMessageReq.sender - 可選的官方帳號發送資訊，可自訂發送者顯示
   * @param templateImageCarouselMessageReq.quickReplyItems - 可選的快速回覆按鈕
   * @returns {TemplateMessage} 圖片輪播模板訊息物件
   * @see https://developers.line.biz/en/reference/messaging-api/#image-carousel
   */
  createTemplateImageCarouselMessage(
    templateImageCarouselMessageReq: TemplateImageCarouselMessageReq,
  ): TemplateMessage {
    const { altText, cards, sender, quickReplyItems } =
      templateImageCarouselMessageReq;

    const templateImageCarouselMessage: TemplateMessage = {
      type: MessageType.Template,
      altText,
      template: {
        type: MessageType.TemplateImageCarousel,
        columns: [...cards],
      },
      ...this.buildCommonMessageProps(sender, quickReplyItems),
    };
    return templateImageCarouselMessage;
  }

  createImageMapMessage(imageMapMessageReq: ImageMapMessageReq) {
    const {
      baseUrl,
      altText,
      baseSize = {
        width: 1040,
        height: 1040,
      },
      actions,
      sender,
      quickReplyItems,
      video,
    } = imageMapMessageReq;

    const imageMapMessage: ImageMapMessage = {
      type: MessageType.ImageMap,
      baseUrl,
      altText,
      baseSize,
      actions,
      ...(video && { video }),
      ...this.buildCommonMessageProps(sender, quickReplyItems),
    };

    return imageMapMessage;
  }
}

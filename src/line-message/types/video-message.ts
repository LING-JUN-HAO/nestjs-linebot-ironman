import { QuickReplyItem, Sender } from '@line/bot-sdk';

type HttpsURL = `https://${string}`;

export type VideoMessageReq = {
  originalContentUrl: HttpsURL;
  previewImageUrl: HttpsURL;
  sender?: Sender;
  quickReplyItems?: Omit<QuickReplyItem, 'type'>[];
};

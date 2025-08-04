import { QuickReplyItem, Sender } from '@line/bot-sdk';

type HttpsURL = `https://${string}`;

export type AudioMessageReq = {
  originalContentUrl: HttpsURL;
  duration: number;
  sender?: Sender;
  quickReplyItems?: Omit<QuickReplyItem, 'type'>[];
};

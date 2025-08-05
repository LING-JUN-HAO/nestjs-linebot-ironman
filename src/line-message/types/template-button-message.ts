import { Action, QuickReplyItem, Sender } from '@line/bot-sdk';

type HttpsURL = `https://${string}`;

export type TemplateButtonMessageReq = {
  altText: string;
  text: string;
  actions: Action[];
  title?: string;
  thumbnailImageUrl?: HttpsURL;
  sender?: Sender;
  quickReplyItems?: Omit<QuickReplyItem, 'type'>[];
};

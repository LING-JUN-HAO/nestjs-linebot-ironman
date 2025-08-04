import { QuickReplyItem, Sender } from '@line/bot-sdk';

export type LocationMessageReq = {
  title: string;
  address: string;
  latitude: number;
  longitude: number;
  sender?: Sender;
  quickReplyItems?: Omit<QuickReplyItem, 'type'>[];
};

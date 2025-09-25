import { QuickReplyItem, Sender, LocationEventMessage } from '@line/bot-sdk';

export type LocationMessageReq = {
  sender?: Sender;
  quickReplyItems?: Omit<QuickReplyItem, 'type'>[];
} & Omit<LocationEventMessage, 'type' | 'id'>;

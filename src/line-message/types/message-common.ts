import { QuickReplyItem, Sender } from '@line/bot-sdk';

export type MessageCommon = {
  sender?: Sender;
  quickReplyItems?: Omit<QuickReplyItem, 'type'>[];
};

import { QuickReplyItem, Sender } from '@line/bot-sdk';

export type CommonMessageProps = {
  sender?: Sender;
  quickReply?: {
    items: QuickReplyItem[];
  };
};

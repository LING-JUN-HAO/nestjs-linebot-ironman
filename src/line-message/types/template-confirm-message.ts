import { Action, QuickReplyItem, Sender } from '@line/bot-sdk';

export type TemplateConfirmMessageReq = {
  altText: string;
  text: string;
  actions: [Action, Action];
  sender?: Sender;
  quickReplyItems?: Omit<QuickReplyItem, 'type'>[];
};

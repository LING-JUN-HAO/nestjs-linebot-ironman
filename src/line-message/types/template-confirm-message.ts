import { Action } from '@line/bot-sdk';
import { MessageCommon } from './message-common';

export type TemplateConfirmMessageReq = MessageCommon & {
  altText: string;
  text: string;
  actions: [Action, Action];
};

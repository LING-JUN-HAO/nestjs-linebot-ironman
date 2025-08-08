import { Action } from '@line/bot-sdk';
import { MessageCommon } from './message-common';

type HttpsURL = `https://${string}`;

export type TemplateButtonMessageReq = MessageCommon & {
  altText: string;
  text: string;
  actions: Action[];
  title?: string;
  thumbnailImageUrl?: HttpsURL;
};

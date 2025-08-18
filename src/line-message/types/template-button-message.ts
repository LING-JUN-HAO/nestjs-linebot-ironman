import { MessageCommon } from './message-common';
import { ButtonsTemplate } from '@line/bot-sdk/lib/messaging-api/model/models';

type HttpsURL = `https://${string}`;

export type TemplateButtonMessageReq = MessageCommon &
  Pick<ButtonsTemplate, 'text' | 'actions' | 'title' | 'thumbnailImageUrl'> & {
    altText: string;
    thumbnailImageUrl?: HttpsURL;
  };

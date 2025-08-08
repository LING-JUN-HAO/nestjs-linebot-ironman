import { ImageMapMessage, Size } from '@line/bot-sdk';
import { MessageCommon } from './message-common';

type HttpsURL = `https://${string}`;

export type ImageMapMessageReq = MessageCommon &
  Omit<ImageMapMessage, 'type' | 'baseSize'> & {
    baseUrl: HttpsURL;
    baseSize?: Size;
  };

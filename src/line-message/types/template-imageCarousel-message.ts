import { TemplateImageColumn } from '@line/bot-sdk';
import { MessageCommon } from './message-common';

export type TemplateImageCarouselMessageReq = MessageCommon & {
  altText: string;
  cards: TemplateImageColumn[];
};

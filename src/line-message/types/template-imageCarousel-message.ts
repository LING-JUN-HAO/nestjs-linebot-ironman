import { QuickReplyItem, Sender, TemplateImageColumn } from '@line/bot-sdk';

export type TemplateImageCarouselMessageReq = {
  altText: string;
  cards: TemplateImageColumn[];
  sender?: Sender;
  quickReplyItems?: Omit<QuickReplyItem, 'type'>[];
};

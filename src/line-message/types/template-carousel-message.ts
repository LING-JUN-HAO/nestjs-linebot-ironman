import { QuickReplyItem, Sender, TemplateColumn } from '@line/bot-sdk';

type FixedArray<T, N extends number> = T[] & { length: N };

type LimitedActionColumn<N extends number> = Omit<
  TemplateColumn,
  'defaultAction' | 'imageBackgroundColor' | 'actions'
> & {
  actions: FixedArray<TemplateColumn['actions'][number], N>;
};

export type TemplateCarouselMessageReq<N extends number = number> = {
  altText: string;
  cards: LimitedActionColumn<N>[];
  sender?: Sender;
  quickReplyItems?: Omit<QuickReplyItem, 'type'>[];
};

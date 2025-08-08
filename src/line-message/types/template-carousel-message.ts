import { TemplateColumn } from '@line/bot-sdk';
import { MessageCommon } from './message-common';

type FixedArray<T, N extends number> = T[] & { length: N };

type LimitedActionColumn<N extends number> = Omit<
  TemplateColumn,
  'defaultAction' | 'imageBackgroundColor' | 'actions'
> & {
  actions: FixedArray<TemplateColumn['actions'][number], N>;
};

export type TemplateCarouselMessageReq<N extends number = number> =
  MessageCommon & {
    altText: string;
    cards: LimitedActionColumn<N>[];
  };

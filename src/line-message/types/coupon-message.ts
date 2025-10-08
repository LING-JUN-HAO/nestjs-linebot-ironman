import { MessageCommon } from './message-common';
import { CouponMessage } from '@line/bot-sdk/lib/messaging-api/model/models';

export type CouponMessageReq = MessageCommon & Omit<CouponMessage, 'type'>;

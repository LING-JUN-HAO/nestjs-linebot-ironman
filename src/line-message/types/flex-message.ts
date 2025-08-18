import { MessageCommon } from './message-common';
import { FlexMessage } from '@line/bot-sdk/lib/messaging-api/model/models';

export type FlexMessageReq = MessageCommon & Omit<FlexMessage, 'type'>;

import { MessageCommon } from './message-common';
import { LocationMessage } from '@line/bot-sdk/lib/messaging-api/model/models';

export type LocationMessageReq = MessageCommon & Omit<LocationMessage, 'type'>;

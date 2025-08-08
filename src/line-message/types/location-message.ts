import { MessageCommon } from './message-common';

export type LocationMessageReq = MessageCommon & {
  title: string;
  address: string;
  latitude: number;
  longitude: number;
};

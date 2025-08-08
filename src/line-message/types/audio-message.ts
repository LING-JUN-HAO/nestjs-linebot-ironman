import { MessageCommon } from './message-common';

type HttpsURL = `https://${string}`;

export type AudioMessageReq = MessageCommon & {
  originalContentUrl: HttpsURL;
  duration: number;
};

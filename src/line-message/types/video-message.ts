import { MessageCommon } from './message-common';

type HttpsURL = `https://${string}`;

export type VideoMessageReq = MessageCommon & {
  originalContentUrl: HttpsURL;
  previewImageUrl: HttpsURL;
};

import { MessageCommon } from './message-common';

type HttpsURL = `https://${string}`;

export type ImageMessageReq = MessageCommon & {
  originalContentUrl: HttpsURL;
  previewImageUrl: HttpsURL;
};

import { WebhookEvent, EventMessage } from '@line/bot-sdk';
import { Message } from '@line/bot-sdk/lib/messaging-api/model/message';

export type WebhookEventHandlerMap = {
  [K in WebhookEvent['type']]: (
    event: Extract<WebhookEvent, { type: K }>,
  ) => Promise<void>;
};

export type MessageEventHandlerMap = {
  [K in EventMessage['type']]: (
    event: Extract<EventMessage, { type: K }>,
  ) => Message;
};

import { WebhookEvent, EventMessage, Message } from '@line/bot-sdk';

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

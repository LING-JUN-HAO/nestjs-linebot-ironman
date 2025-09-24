import { WebhookEvent, EventMessage } from '@line/bot-sdk';
import { TextMessageV2 } from '@line/bot-sdk/dist/messaging-api/api';
import { Message } from '@line/bot-sdk/lib/messaging-api/model/message';

export type WebhookEventHandlerMap = {
  [K in WebhookEvent['type']]: (
    event: Extract<WebhookEvent, { type: K }>,
  ) => Promise<void>;
};

type MsgReturn<K extends EventMessage['type']> = K extends 'text'
  ? TextMessageV2
  : Extract<Message, { type: K }>;

export type MessageEventHandlerMap = {
  [K in EventMessage['type']]: (
    event: Extract<EventMessage, { type: K }>,
  ) => MsgReturn<K>;
};

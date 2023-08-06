import { InjectionToken } from "@angular/core";

export const IN_APP_CHAT_TWILIO_EVENT_HANDLER_PRIMARY_PORT: InjectionToken<InAppChatTwilioEventHandlerPrimaryPort> = new InjectionToken(
  'IN_APP_CHAT_TWILIO_EVENT_HANDLER_PRIMARY_PORT'
);

export interface InAppChatTwilioEventHandlerPrimaryPort {

  startProcessingChatThreadMessageAdded(threadIds: string[]): void;

  stopProcessingChatThreadMessageAdded(): void;

  startProcessingChatThreadUpdates(): void;

  stopProcessingChatThreadUpdates(): void;
}

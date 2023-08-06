import { Observable } from "rxjs";
import { InjectionToken } from "@angular/core";
import { Conversation, ConversationUpdateReason, Message } from "@twilio/conversations";

export const IN_APP_CHAT_TWILIO_EVENT_HANDLER_SECONDARY_PORT: InjectionToken<InAppChatTwilioEventHandlerSecondaryPort> = new InjectionToken(
  'IN_APP_CHAT_TWILIO_EVENT_HANDLER_SECONDARY_PORT'
);

export interface InAppChatTwilioEventHandlerSecondaryPort {
  
  startListeningChatThreadMessageAdded(threadIds: string[]): void;

  stopListeningChatThreadMessageAdded(): void;

  getNewMessage(): Observable<Message>;

  startListeningChatThreadParticipantUpdates(threadIds: string[]): void;

  stopListeningChatThreadParticipantUpdates(): void;

  startListeningChatThreadUpdates(): void;

  stopListeningChatThreadUpdates(): void;

  getNewChatThread(): Observable<Conversation>;

  getRemovedChatThread(): Observable<Conversation>;

  getChatThreadUpdate(): Observable<{ conversation: Conversation; updateReasons: ConversationUpdateReason[]; }>;
}

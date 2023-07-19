import { Observable } from "rxjs";
import { InjectionToken } from "@angular/core";
import { Message } from "@twilio/conversations";

export const IN_APP_CHAT_LIVE_UPDATE_SECONDARY_PORT: InjectionToken<InAppChatLiveUpdateSecondaryPort> = new InjectionToken(
  'IN_APP_CHAT_LIVE_UPDATE_SECONDARY_PORT'
);

export interface InAppChatLiveUpdateSecondaryPort {
  
  startListeningChatThreadUpdates(threadIds: string[]): void;

  stopListeningChatThreadUpdates(): void;

  getNewMessage(): Observable<Message>;
}

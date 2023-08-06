import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";
import { Client, Conversation } from "@twilio/conversations";

export const IN_APP_CHAT_TWILIO_THREAD_SECONDARY_PORT: InjectionToken<InAppChatTwilioThreadSecondaryPort> = new InjectionToken(
  'IN_APP_CHAT_TWILIO_THREAD_SECONDARY_PORT'
);

export interface InAppChatTwilioThreadSecondaryPort {
  
  getChatThread(threadId: string): Observable<Conversation>;

  getAllCachedChatThreads(): Conversation[];

  clearCachedData(): void;
}

import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";

export const IN_APP_CHAT_TWILIO_MESSAGE_SECONDARY_PORT: InjectionToken<InAppChatTwilioMessageSecondaryPort> = new InjectionToken(
  'IN_APP_CHAT_TWILIO_MESSAGE_SECONDARY_PORT'
);

export interface InAppChatTwilioMessageSecondaryPort {
  
  sendTextMessage(threadId: string, message: string): Observable<number>;

  sendMediaMessage(threadId: string, file: File): Observable<number>;

  getMediaMessageTemporaryUrl(messageId: string): Observable<string>;
  
  setAllMessagesRead(threadId: string): void;
}

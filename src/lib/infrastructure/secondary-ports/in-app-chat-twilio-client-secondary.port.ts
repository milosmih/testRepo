import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";
import { Client } from "@twilio/conversations";

export const IN_APP_CHAT_TWILIO_CLIENT_SECONDARY_PORT: InjectionToken<InAppChatTwilioClientSecondaryPort> = new InjectionToken(
  'IN_APP_CHAT_TWILIO_CLIENT_SECONDARY_PORT'
);

export interface InAppChatTwilioClientSecondaryPort {
  
  getClient(): Observable<Client>;

  destroyClient(): void;
}

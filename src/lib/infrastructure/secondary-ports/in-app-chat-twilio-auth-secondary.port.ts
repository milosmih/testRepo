import { Observable } from "rxjs";
import { InjectionToken } from "@angular/core";

export const IN_APP_CHAT_TWILIO_AUTH_SECONDARY_PORT: InjectionToken<InAppChatTwilioAuthSecondaryPort> = new InjectionToken(
  'IN_APP_CHAT_TWILIO_AUTH_SECONDARY_PORT'
);

export interface InAppChatTwilioAuthSecondaryPort {

  getToken(): Observable<{ token: string }>;
}

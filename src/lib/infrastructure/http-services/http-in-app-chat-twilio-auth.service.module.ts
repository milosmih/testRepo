import { NgModule } from '@angular/core';
import { HttpInAppChatTwilioAuthService } from './http-in-app-chat-twilio-auth.service';
import { IN_APP_CHAT_TWILIO_AUTH_SECONDARY_PORT } from '../secondary-ports/in-app-chat-twilio-auth-secondary.port';

@NgModule({
  providers: [
    { provide: IN_APP_CHAT_TWILIO_AUTH_SECONDARY_PORT, useExisting: HttpInAppChatTwilioAuthService },
  ]
})
export class HttpInAppChatTwilioAuthServiceModule { }

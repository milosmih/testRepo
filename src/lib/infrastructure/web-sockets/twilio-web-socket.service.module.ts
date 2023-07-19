import { NgModule } from '@angular/core';
import { IN_APP_CHAT_LIVE_UPDATE_SECONDARY_PORT } from '../secondary-ports/in-app-chat-live-update-secondary.port';
import { TwilioWebSocketService } from './twilio-web-socket.service';

@NgModule({
  providers: [
    { provide: IN_APP_CHAT_LIVE_UPDATE_SECONDARY_PORT, useExisting: TwilioWebSocketService }
  ]
})
export class TwilioWebSocketServiceModule { }

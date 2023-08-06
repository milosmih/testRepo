import { NgModule } from '@angular/core';
import { IN_APP_CHAT_TWILIO_EVENT_HANDLER_SECONDARY_PORT } from '../secondary-ports/in-app-chat-twilio-event-handler-secondary.port';
import { TwilioWebSocketEventHandlerService } from './twilio-web-socket-event-handler.service';
import { TwilioWebSocketClientService } from './twilio-web-socket-client.service';
import { IN_APP_CHAT_TWILIO_CLIENT_SECONDARY_PORT } from '../secondary-ports/in-app-chat-twilio-client-secondary.port';
import { IN_APP_CHAT_CONTROLLER_SECONDARY_PORT } from '../secondary-ports/in-app-chat-controller-secondary.port';
import { TwilioWebSocketControllerService } from './twilio-web-socket-controller.service';
import { TwilioWebSocketChatThreadService } from './twilio-web-socket-chat-thread.service';
import { IN_APP_CHAT_TWILIO_THREAD_SECONDARY_PORT } from '../secondary-ports/in-app-chat-twilio-thread-secondary.port';
import { TwilioWebSocketMessageService } from './twilio-web-socket-message.service';
import { IN_APP_CHAT_TWILIO_MESSAGE_SECONDARY_PORT } from '../secondary-ports/in-app-chat-twilio-message-secondary.port';

@NgModule({
  providers: [
    { provide: IN_APP_CHAT_TWILIO_CLIENT_SECONDARY_PORT, useExisting: TwilioWebSocketClientService },
    { provide: IN_APP_CHAT_TWILIO_THREAD_SECONDARY_PORT, useExisting: TwilioWebSocketChatThreadService },
    { provide: IN_APP_CHAT_CONTROLLER_SECONDARY_PORT, useExisting: TwilioWebSocketControllerService },
    { provide: IN_APP_CHAT_TWILIO_EVENT_HANDLER_SECONDARY_PORT, useExisting: TwilioWebSocketEventHandlerService },
    { provide: IN_APP_CHAT_TWILIO_MESSAGE_SECONDARY_PORT, useExisting: TwilioWebSocketMessageService }
  ]
})
export class TwilioWebSocketServiceModule { }

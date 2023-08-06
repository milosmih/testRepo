import { Inject, Injectable } from '@angular/core';
import { IN_APP_CHAT_TWILIO_CLIENT_SECONDARY_PORT, InAppChatTwilioClientSecondaryPort } from '../secondary-ports/in-app-chat-twilio-client-secondary.port';
import { InAppChatControllerSecondaryPort } from '../secondary-ports/in-app-chat-controller-secondary.port';
import { IN_APP_CHAT_TWILIO_EVENT_HANDLER_SECONDARY_PORT, InAppChatTwilioEventHandlerSecondaryPort } from '../secondary-ports/in-app-chat-twilio-event-handler-secondary.port';


@Injectable({ providedIn: 'root' })
export class TwilioWebSocketControllerService implements InAppChatControllerSecondaryPort {

  constructor(@Inject(IN_APP_CHAT_TWILIO_CLIENT_SECONDARY_PORT) private twilioClientSecondaryPort: InAppChatTwilioClientSecondaryPort,
  @Inject(IN_APP_CHAT_TWILIO_EVENT_HANDLER_SECONDARY_PORT) private twilioEventHandlerSecondaryPort: InAppChatTwilioEventHandlerSecondaryPort) {
  }

  startChat(): void {
    this.twilioEventHandlerSecondaryPort.startListeningChatThreadUpdates();
  }

  stopChat(): void {
    this.twilioClientSecondaryPort.destroyClient();
  }
}

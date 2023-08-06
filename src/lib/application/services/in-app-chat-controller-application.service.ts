import { Inject, Injectable } from '@angular/core';
import { InAppChatControllerPrimaryPort } from '../primary-ports/in-app-chat-controller-primary.port';
import { IN_APP_CHAT_CONTROLLER_SECONDARY_PORT, InAppChatControllerSecondaryPort } from '../../infrastructure/secondary-ports/in-app-chat-controller-secondary.port';
import { IN_APP_CHAT_TWILIO_EVENT_HANDLER_PRIMARY_PORT, InAppChatTwilioEventHandlerPrimaryPort } from '../primary-ports/in-app-chat-twilio-event-handler-primary.port';


@Injectable()
export class InAppChatControllerApplicationService implements InAppChatControllerPrimaryPort {

  constructor(@Inject(IN_APP_CHAT_CONTROLLER_SECONDARY_PORT) private inAppChatControllerSecondaryPort: InAppChatControllerSecondaryPort,
  @Inject(IN_APP_CHAT_TWILIO_EVENT_HANDLER_PRIMARY_PORT) private twilioEventHandlerPrimaryPort: InAppChatTwilioEventHandlerPrimaryPort) {
  }


  startChat(): void {
    this.inAppChatControllerSecondaryPort.startChat();
    this.twilioEventHandlerPrimaryPort.startProcessingChatThreadUpdates();
  }

  stopChat(): void {
    this.inAppChatControllerSecondaryPort.stopChat();
    this.twilioEventHandlerPrimaryPort.stopProcessingChatThreadUpdates();
  }

}

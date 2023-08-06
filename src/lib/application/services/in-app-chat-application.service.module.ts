import { NgModule } from '@angular/core';
import { CurrentUserRoleModule } from '@common';
import { DismissLoadingPopupModule } from 'src/app/alert/dismiss-loading-popup.module';
import { LoadingPopupModule } from 'src/app/alert/loading-popup.module';
import { IN_APP_CHAT_MODAL_CONTROL_PRIMARY_PORT } from '../primary-ports/in-app-chat-modal-control-primary.port';
import { InAppChatNewChatThreadCommunicationService } from './in-app-chat-new-chat-thread-communication.service';
import { HttpInAppChatServiceModule } from '../../infrastructure/http-services/http-in-app-chat.service.module';
import { IN_APP_CHAT_THREAD_PRIMARY_PORT } from '../primary-ports/in-app-chat-thread-primary.port';
import { InAppChatThreadApplicationService } from './in-app-chat-thread-application.service';
import { InAppChatModalControlApplicationService } from './in-app-chat-modal-control-application.service';
import { InAppChatMessageApplicationService } from './in-app-chat-message-application.service';
import { IN_APP_CHAT_MESSAGE_PRIMARY_PORT } from '../primary-ports/in-app-chat-message-primary.port';
import { InAppChatNotificationPopupApplicationService } from './in-app-chat-notification-popup-application.service';
import { IN_APP_CHAT_NOTIFICATION_POPUP_PRIMARY_PORT } from '../primary-ports/in-app-chat-notification-popup-primary.port';
import { IN_APP_CHAT_NEW_CHAT_THREAD_COMMUNICATION_PRIMARY_PORT } from '../primary-ports/in-app-chat-new-chat-thread-communication-primary.port';
import { InAppChatTwilioEventHandlerApplicationService } from './in-app-chat-twilio-event-handler-application.service';
import { IN_APP_CHAT_TWILIO_EVENT_HANDLER_PRIMARY_PORT } from '../primary-ports/in-app-chat-twilio-event-handler-primary.port';
import { HttpInAppChatTwilioAuthServiceModule } from '../../infrastructure/http-services/http-in-app-chat-twilio-auth.service.module';
import { TwilioWebSocketServiceModule } from '../../infrastructure/web-sockets/twilio-web-socket.service.module';
import { IN_APP_CHAT_CONTROLLER_PRIMARY_PORT } from '../primary-ports/in-app-chat-controller-primary.port';
import { InAppChatControllerApplicationService } from './in-app-chat-controller-application.service';

@NgModule({
  imports: [
    HttpInAppChatTwilioAuthServiceModule,
    HttpInAppChatServiceModule,
    TwilioWebSocketServiceModule,
    DismissLoadingPopupModule,
    CurrentUserRoleModule,
    LoadingPopupModule
  ],
  declarations: [],
  providers: [
    InAppChatControllerApplicationService,
    InAppChatThreadApplicationService,
    InAppChatMessageApplicationService,
    InAppChatModalControlApplicationService,
    InAppChatNotificationPopupApplicationService,
    { provide: IN_APP_CHAT_CONTROLLER_PRIMARY_PORT, useExisting: InAppChatControllerApplicationService },
    { provide: IN_APP_CHAT_NEW_CHAT_THREAD_COMMUNICATION_PRIMARY_PORT, useExisting: InAppChatNewChatThreadCommunicationService },
    { provide: IN_APP_CHAT_THREAD_PRIMARY_PORT, useExisting: InAppChatThreadApplicationService },
    { provide: IN_APP_CHAT_MESSAGE_PRIMARY_PORT, useExisting: InAppChatMessageApplicationService },
    { provide: IN_APP_CHAT_MODAL_CONTROL_PRIMARY_PORT, useExisting: InAppChatModalControlApplicationService },
    { provide: IN_APP_CHAT_TWILIO_EVENT_HANDLER_PRIMARY_PORT, useExisting: InAppChatTwilioEventHandlerApplicationService },
    { provide: IN_APP_CHAT_NOTIFICATION_POPUP_PRIMARY_PORT, useExisting: InAppChatNotificationPopupApplicationService }
  ],
  exports: []
})
export class InAppChatApplicationServiceModule { }

import { NgModule } from '@angular/core';
import { HttpInAppChatService } from './http-in-app-chat.service';
import { IN_APP_CHAT_THREAD_SECONDARY_PORT } from '../secondary-ports/in-app-chat-thread-secondary.port';
import { IN_APP_CHAT_MESSAGE_SECONDARY_PORT } from '../secondary-ports/in-app-chat-message-secondary.port';

@NgModule({
  providers: [
    { provide: IN_APP_CHAT_THREAD_SECONDARY_PORT, useExisting: HttpInAppChatService },
    { provide: IN_APP_CHAT_MESSAGE_SECONDARY_PORT, useExisting: HttpInAppChatService }
  ]
})
export class HttpInAppChatServiceModule { }

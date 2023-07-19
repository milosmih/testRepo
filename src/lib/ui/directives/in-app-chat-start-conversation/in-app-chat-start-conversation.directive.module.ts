import { NgModule } from '@angular/core';
import { InAppChatStartConversationDirective } from './in-app-chat-start-conversation.directive';
import { InAppChatApplicationServiceModule } from '../../../application/services/in-app-chat-application.service.module';


@NgModule({
  imports: [InAppChatApplicationServiceModule],
  declarations: [InAppChatStartConversationDirective],
  exports: [InAppChatStartConversationDirective]
})
export class InAppChatStartConversationDirectiveModule { }

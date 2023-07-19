import { Component, Inject } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Observable } from 'rxjs';
import { IN_APP_CHAT_MESSAGE_PRIMARY_PORT, InAppChatMessagePrimaryPort } from '../../../application/primary-ports/in-app-chat-message-primary.port';
import { InAppChatApplicationServiceModule } from '../../../application/services/in-app-chat-application.service.module';

@Component({
  selector: 'in-app-chat-sidebar-message-text',
  templateUrl: 'in-app-chat-sidebar-message-text.component.html',
  styleUrls: ['in-app-chat-sidebar-message-text.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    IonicModule,
    InAppChatApplicationServiceModule
  ],
})
export class InAppChatSidebarMessageTextComponent {
  public unreadMessagesCount$: Observable<number> = this.chatMessagePrimaryPort.getUnreadMessagesCount();

  constructor(@Inject(IN_APP_CHAT_MESSAGE_PRIMARY_PORT) private chatMessagePrimaryPort: InAppChatMessagePrimaryPort){
  }
}

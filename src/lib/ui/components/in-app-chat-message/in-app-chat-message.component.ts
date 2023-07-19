import { Component, Input } from '@angular/core';
import { NgIf, DatePipe, NgClass, NgFor } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AvatarComponentModule } from '@nursa/ui-components';
import { ChatMessage } from '../../../domain/models/grouped-chat-message';
import { ChatMessageAuthor } from '../../../domain/models/chat-message-author';


@Component({
  selector: 'app-in-app-chat-message',
  templateUrl: 'in-app-chat-message.component.html',
  styleUrls: ['in-app-chat-message.component.scss'],
  standalone: true,
  imports: [AvatarComponentModule, NgIf, NgFor, DatePipe, IonicModule, NgClass],
})
export class InAppChatMessageComponent {
  @Input() message: ChatMessage;
  @Input() author: ChatMessageAuthor;

}

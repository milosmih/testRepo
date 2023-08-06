import { Component, Inject, Input } from '@angular/core';
import { NgIf, DatePipe, NgClass, NgFor, AsyncPipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { IN_APP_CHAT_MESSAGE_PRIMARY_PORT, InAppChatMessagePrimaryPort } from '../../../application/primary-ports/in-app-chat-message-primary.port';
import { DefaultMediaFileUrl } from '../../constants/media-file.constants';
import { Observable } from 'rxjs';


@Component({
  selector: 'in-app-chat-media-message',
  templateUrl: 'in-app-chat-media-message.component.html',
  styleUrls: ['in-app-chat-media-message.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, AsyncPipe, IonicModule, NgClass]
})
export class InAppChatMediaMessageComponent {
  @Input() set mediaMessage(value: any) {
    this.isMediaMessageAnImage = this.chatMessagePrimaryPort.isMediaMessageAnImage(value.content_type);
    this.mediaMessageTemporaryUrl$ = this.chatMessagePrimaryPort.getMediaMessageTemporaryUrl(value.sid);
    this.message = value;
  };

  public message: any;
  public mediaMessageTemporaryUrl$: Observable<string>;
  public isMediaMessageAnImage: boolean;
  public DefaultMediaFileUrl = DefaultMediaFileUrl;

  constructor(@Inject(IN_APP_CHAT_MESSAGE_PRIMARY_PORT) private chatMessagePrimaryPort: InAppChatMessagePrimaryPort) {
  }



}

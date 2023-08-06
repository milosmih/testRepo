import { Component, Inject, Input } from '@angular/core';
import { NgIf, DatePipe, AsyncPipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AvatarComponentModule } from '@nursa/ui-components';
import { FormatWeekdayDatePipe } from 'src/app/shared/pipes/format-weekday-date.pipe';
import { CurrentTimeOrDatePipe } from 'src/app/shared/pipes/current-time-or-date.pipe';
import { ChatThread } from '../../../domain/models/chat-thread';
import { IN_APP_CHAT_MESSAGE_PRIMARY_PORT, InAppChatMessagePrimaryPort } from '../../../application/primary-ports/in-app-chat-message-primary.port';
import { Observable, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-in-app-chat-thread',
  templateUrl: 'in-app-chat-thread.component.html',
  styleUrls: ['in-app-chat-thread.component.scss'],
  standalone: true,
  imports: [
    AvatarComponentModule,
    NgIf,
    AsyncPipe,
    DatePipe,
    IonicModule,
    FormatWeekdayDatePipe,
    CurrentTimeOrDatePipe
  ],
})
export class InAppChatThreadComponent {
  @Input() thread: ChatThread;

  public unreadMessagesCount$: Observable<number>;

  constructor(@Inject(IN_APP_CHAT_MESSAGE_PRIMARY_PORT) private chatMessagePrimaryPort: InAppChatMessagePrimaryPort) {
  }

  ngOnInit(): void {
    this.subscribeToUnreadMessagesCount();
  }

  private subscribeToUnreadMessagesCount(): void {
    this.unreadMessagesCount$ = this.chatMessagePrimaryPort.getChatThreadUnreadMessagesCount(this.thread.threadId)
      .pipe(
        debounceTime(1000),
        distinctUntilChanged()
      )
  }
}

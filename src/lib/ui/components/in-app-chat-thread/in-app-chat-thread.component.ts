import { Component, Input } from '@angular/core';
import { NgIf, DatePipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AvatarComponentModule } from '@nursa/ui-components';
import { FormatWeekdayDatePipe } from 'src/app/shared/pipes/format-weekday-date.pipe';
import { CurrentTimeOrDatePipe } from 'src/app/shared/pipes/current-time-or-date.pipe';
import { ChatThread } from '../../../domain/models/chat-thread';

@Component({
  selector: 'app-in-app-chat-thread',
  templateUrl: 'in-app-chat-thread.component.html',
  styleUrls: ['in-app-chat-thread.component.scss'],
  standalone: true,
  imports: [
    AvatarComponentModule,
    NgIf,
    DatePipe,
    IonicModule,
    FormatWeekdayDatePipe,
    CurrentTimeOrDatePipe
  ],
})
export class InAppChatThreadComponent {
  @Input() thread: ChatThread;
}

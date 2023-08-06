import { Component, Inject, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MatTabsModule } from '@angular/material/tabs';
import { Observable, tap } from 'rxjs';
import { SkeletonsModule } from '@nursa/ui-components';
import { NursaNavbarComponentModule } from 'src/app/components/nursa-navbar/nursa-navbar.component.module';
import { InAppChatApplicationServiceModule } from '../../../application/services/in-app-chat-application.service.module';
import { IN_APP_CHAT_THREAD_PRIMARY_PORT, InAppChatThreadPrimaryPort } from '../../../application/primary-ports/in-app-chat-thread-primary.port';
import { InAppChatThreadComponent } from '../../components/in-app-chat-thread/in-app-chat-thread.component';
import { ChatThread } from '../../../domain/models/chat-thread';
import { IN_APP_CHAT_TWILIO_EVENT_HANDLER_PRIMARY_PORT, InAppChatTwilioEventHandlerPrimaryPort } from '../../../application/primary-ports/in-app-chat-twilio-event-handler-primary.port';
import { IN_APP_CHAT_MODAL_CONTROL_PRIMARY_PORT, InAppChatModalControlPrimaryPort } from '../../../application/primary-ports/in-app-chat-modal-control-primary.port';
import { IN_APP_CHAT_MESSAGE_PRIMARY_PORT, InAppChatMessagePrimaryPort } from '../../../application/primary-ports/in-app-chat-message-primary.port';

@Component({
  selector: 'app-in-app-chat-main',
  templateUrl: 'in-app-chat-main.page.html',
  styleUrls: ['in-app-chat-main.page.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    AsyncPipe,
    MatTabsModule,
    IonicModule,
    NursaNavbarComponentModule,
    InAppChatApplicationServiceModule,
    InAppChatThreadComponent,
    SkeletonsModule
  ]
})
export class InAppChatMainPage implements OnInit, OnDestroy {
  public chatThreads$: Observable<ChatThread[]> = this.chatThreadPrimaryPort.getChatThreads()
    .pipe(tap(() => setTimeout(() => {
      this.cdr.detectChanges()
    }, 150)));

  public chatThreadsLoading$: Observable<boolean> = this.chatThreadPrimaryPort.getChatThreadsLoading();

  constructor(private cdr: ChangeDetectorRef,
    @Inject(IN_APP_CHAT_THREAD_PRIMARY_PORT) private chatThreadPrimaryPort: InAppChatThreadPrimaryPort,
    @Inject(IN_APP_CHAT_MESSAGE_PRIMARY_PORT) private chatMessagePrimaryPort: InAppChatMessagePrimaryPort,
    @Inject(IN_APP_CHAT_MODAL_CONTROL_PRIMARY_PORT) private chatModalControlPrimaryPort: InAppChatModalControlPrimaryPort,
    @Inject(IN_APP_CHAT_TWILIO_EVENT_HANDLER_PRIMARY_PORT) private chatLiveUpdatePrimaryPort: InAppChatTwilioEventHandlerPrimaryPort) {
  }

  ngOnInit(): void {
    this.chatThreadPrimaryPort.loadChatThreads();
  }

  onClickChatThread(threadId: string, title: string) {
    this.chatModalControlPrimaryPort.openExistingChat(threadId, title);
  }

  ngOnDestroy(): void {
    this.chatLiveUpdatePrimaryPort.stopProcessingChatThreadMessageAdded();
    this.chatMessagePrimaryPort.clearStorageData();
  }
}

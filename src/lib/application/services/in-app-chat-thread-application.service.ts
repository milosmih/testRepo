import { Inject, Injectable } from '@angular/core';
import { Observable, finalize, map, tap, BehaviorSubject } from 'rxjs';
import { IsCurrentNursePort, IS_CURRENT_USER_NURSE } from '@common';
import { ChatThread } from '../../domain/models/chat-thread';
import { ClinicianChatThreadDTO, FacilityUserChatThreadDTO } from '../../infrastructure/models/chat-thread.dto';
import { ChatThreadMapper } from '../domain-model-mappers/chat-thread.mapper';
import { InAppChatThreadStorage } from '../storages/in-app-chat-thread.storage';
import { IN_APP_CHAT_THREAD_SECONDARY_PORT, InAppChatThreadSecondaryPort } from '../../infrastructure/secondary-ports/in-app-chat-thread-secondary.port';
import { InAppChatThreadPrimaryPort } from '../primary-ports/in-app-chat-thread-primary.port';
import { IN_APP_CHAT_TWILIO_EVENT_HANDLER_PRIMARY_PORT, InAppChatTwilioEventHandlerPrimaryPort } from '../primary-ports/in-app-chat-twilio-event-handler-primary.port';


@Injectable()
export class InAppChatThreadApplicationService implements InAppChatThreadPrimaryPort {
  private loadingChatThreadsSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(@Inject(IN_APP_CHAT_THREAD_SECONDARY_PORT) private chatThreadSecondaryPort: InAppChatThreadSecondaryPort,
    @Inject(IN_APP_CHAT_TWILIO_EVENT_HANDLER_PRIMARY_PORT) private chatLiveUpdatePrimaryPort: InAppChatTwilioEventHandlerPrimaryPort,
    @Inject(IS_CURRENT_USER_NURSE) private readonly isCurrentNursePort: IsCurrentNursePort,
    private chatThreadStorage: InAppChatThreadStorage) { 
    }


  loadChatThreads(): void {
    this.loadingChatThreadsSubject.next(true);
    this.isCurrentNursePort.isCurrentUserNurse() ?
      this.loadClinicianChatThreads() :
      this.loadFacilityUserChatThreads();
  }

  getChatThreads(): Observable<ChatThread[]> {
    return this.chatThreadStorage.select();
  }

  getChatThreadsLoading(): Observable<boolean> {
    return this.loadingChatThreadsSubject.asObservable();
  }

  private loadClinicianChatThreads(): void {
    this.chatThreadSecondaryPort.getClinicianChatThreads()
      .pipe(
        map((response: ClinicianChatThreadDTO[]) => response.map(ChatThreadMapper.fromClinicianDTO)),
        tap((mappedResponse: ChatThread[]) => this.chatThreadStorage.set(mappedResponse)),
        tap((mappedResponse: ChatThread[]) => this.chatLiveUpdatePrimaryPort.startProcessingChatThreadMessageAdded(mappedResponse.map(chatThread => chatThread.threadId))),
        finalize(() => this.loadingChatThreadsSubject.next(false))
      ).subscribe()
  }

  private loadFacilityUserChatThreads(): void {
    this.chatThreadSecondaryPort.getFacilityUserChatThreads()
      .pipe(
        map((response: FacilityUserChatThreadDTO[]) => response.map(ChatThreadMapper.fromFacilityUserDTO)),
        tap((mappedResponse: ChatThread[]) => this.chatThreadStorage.set(mappedResponse)),
        tap((mappedResponse: ChatThread[]) => this.chatLiveUpdatePrimaryPort.startProcessingChatThreadMessageAdded(mappedResponse.map(chatThread => chatThread.threadId))),
        finalize(() => this.loadingChatThreadsSubject.next(false))
      ).subscribe()
  }

}

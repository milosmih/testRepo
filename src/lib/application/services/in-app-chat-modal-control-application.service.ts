import { Inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize, map, tap, switchMap, Subscription, take } from 'rxjs';
import { SHOW_LOADING_POPUP, ShowLoadingPopup, DISMISS_LOADING_POPUP, DismissLoadingPopup } from '@common';
import { MODAL_PROVIDER, ModalProvider } from '@nursa/core/tokens';
import { JobsDetailModel } from 'src/app/models/jobs-detail.model';
import { UserDataModel } from 'src/app/models/user-data.model';
import { InAppChatFacilityWelcomeModalComponent } from '../../ui/modals/in-app-chat-facility-welcome-modal/in-app-chat-facility-welcome-modal.component';
import { Scheduler } from '../../domain/models/scheduler';
import { IN_APP_CHAT_THREAD_SECONDARY_PORT, InAppChatThreadSecondaryPort } from '../../infrastructure/secondary-ports/in-app-chat-thread-secondary.port';
import { InAppChatConversationWindowModalComponent } from '../../ui/modals/in-app-chat-conversation-window-modal/in-app-chat-conversation-window-modal.component';
import { InAppChatModalControlPrimaryPort } from '../primary-ports/in-app-chat-modal-control-primary.port';
import { IN_APP_CHAT_NOTIFICATION_POPUP_PRIMARY_PORT, InAppChatNotificationPopupPrimaryPort } from '../primary-ports/in-app-chat-notification-popup-primary.port';
import { IN_APP_CHAT_MESSAGE_PRIMARY_PORT, InAppChatMessagePrimaryPort } from '../primary-ports/in-app-chat-message-primary.port';
import { IN_APP_CHAT_NEW_CHAT_THREAD_COMMUNICATION_PRIMARY_PORT, InAppChatNewChatThreadCommunicationPrimaryPort } from '../primary-ports/in-app-chat-new-chat-thread-communication-primary.port';


@Injectable()
export class InAppChatModalControlApplicationService implements InAppChatModalControlPrimaryPort {

  constructor(@Inject(IN_APP_CHAT_THREAD_SECONDARY_PORT) private chatThreadSecondaryPort: InAppChatThreadSecondaryPort,
    @Inject(IN_APP_CHAT_NOTIFICATION_POPUP_PRIMARY_PORT) private notificationPopupPrimaryPort: InAppChatNotificationPopupPrimaryPort,
    @Inject(IN_APP_CHAT_MESSAGE_PRIMARY_PORT) private chatMessagePrimaryPort: InAppChatMessagePrimaryPort,
    @Inject(IN_APP_CHAT_NEW_CHAT_THREAD_COMMUNICATION_PRIMARY_PORT) private newChatThreadCommunicationPrimaryPort: InAppChatNewChatThreadCommunicationPrimaryPort,
    @Inject(MODAL_PROVIDER) private modalProvider: ModalProvider,
    @Inject(SHOW_LOADING_POPUP) private showLoadingPopup: ShowLoadingPopup,
    @Inject(DISMISS_LOADING_POPUP) private readonly dismissLoadingPopup: DismissLoadingPopup) { }


  openExistingChat(threadId: string): void {
    this.showLoadingPopup.show('Loading data...');
    this.chatMessagePrimaryPort.loadChatThreadMessages(threadId)
      .pipe(
        finalize(() => this.dismissLoadingPopup.dismiss()),
        switchMap(() => {
          return this.modalProvider.showModal$({
            component: InAppChatConversationWindowModalComponent,
            componentProps: {
              threadId: threadId
            }
          })
        })
      )
      .subscribe();
  }

  openNewOrExistingChat(clinicianId: string, facilityId: string): void {
    this.showLoadingPopup.show('Loading data...');
    this.chatThreadSecondaryPort.getChatThreadId(clinicianId, facilityId)
      .pipe(
        map((response: { threadId: string }) => response.threadId),
        finalize(() => this.dismissLoadingPopup.dismiss())
      )
      .subscribe({
        next: (threadId: string) => {
          if (!threadId) {
            this.openNewChat(clinicianId, facilityId);
          } else {
            this.openExistingChat(threadId);
          }
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
          this.notificationPopupPrimaryPort.showErrorAlert('Problem finding a suitable chat. Please try again latter.');
        }
      })
  }

  private async showFacilityWelcomePage(job: JobsDetailModel, clinician: UserDataModel, scheduler: Scheduler, facilityName: string): Promise<void> {
    this.modalProvider.showModal$<boolean | undefined>({
      component: InAppChatFacilityWelcomeModalComponent,
      componentProps: {
        scheduler: scheduler,
        facilityName: facilityName
      }
    }).subscribe(data => {
      // check if clinician click to start new conversation
      if (data) {
        // this.openNewChat();
      }
    })
  }

  private openNewChat(clinicianId: string, facilityId: string): void {
    const subscription = new Subscription();
    let newThreadId: string;
    this.modalProvider.showModal$<string>({
      component: InAppChatConversationWindowModalComponent,
    }).subscribe(() => {
      subscription.unsubscribe();
    })
    subscription.add(
      this.newChatThreadCommunicationPrimaryPort.getCreateNewChatThreadAction()
        .pipe(
          take(1), // create new thread can happen only once in new chat thread modal
          tap(() => this.showLoadingPopup.show('Initializing new chat thread...')),
          switchMap(() => this.chatThreadSecondaryPort.createChatThread(clinicianId, facilityId)),
          map((response: { threadId: string }) => response.threadId),
          finalize(() => this.dismissLoadingPopup.dismiss()),
        ).subscribe({
          next: (threadId: string) => {
            newThreadId = threadId;
            this.newChatThreadCommunicationPrimaryPort.setNewChatThreadId(threadId)
          },
          error: (error: HttpErrorResponse) => {
            console.log(error);
            this.notificationPopupPrimaryPort.showErrorAlert('Problem with initializing new chat thread. Please try again latter.');
          }
        })
    )
  }

}

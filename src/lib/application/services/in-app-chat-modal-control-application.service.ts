import { Inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize, map, tap, switchMap, Subscription, take } from 'rxjs';
import { SHOW_LOADING_POPUP, ShowLoadingPopup, DISMISS_LOADING_POPUP, DismissLoadingPopup } from '@common';
import { MODAL_PROVIDER, ModalProvider } from '@nursa/core/tokens';
import { IN_APP_CHAT_THREAD_SECONDARY_PORT, InAppChatThreadSecondaryPort } from '../../infrastructure/secondary-ports/in-app-chat-thread-secondary.port';
import { InAppChatConversationWindowModalComponent } from '../../ui/modals/in-app-chat-conversation-window-modal/in-app-chat-conversation-window-modal.component';
import { InAppChatModalControlPrimaryPort } from '../primary-ports/in-app-chat-modal-control-primary.port';
import { IN_APP_CHAT_NOTIFICATION_POPUP_PRIMARY_PORT, InAppChatNotificationPopupPrimaryPort } from '../primary-ports/in-app-chat-notification-popup-primary.port';
import { IN_APP_CHAT_MESSAGE_PRIMARY_PORT, InAppChatMessagePrimaryPort } from '../primary-ports/in-app-chat-message-primary.port';
import { IN_APP_CHAT_NEW_CHAT_THREAD_COMMUNICATION_PRIMARY_PORT, InAppChatNewChatThreadCommunicationPrimaryPort } from '../primary-ports/in-app-chat-new-chat-thread-communication-primary.port';
import { IN_APP_CHAT_TWILIO_EVENT_HANDLER_PRIMARY_PORT, InAppChatTwilioEventHandlerPrimaryPort } from '../primary-ports/in-app-chat-twilio-event-handler-primary.port';
import { InAppChatThreadMessagesStorage } from '../storages/in-app-chat-thread-messages.storage';
import { GroupedChatMessage } from '../../domain/models/grouped-chat-message';
import { NewChatThreadResponseDTO } from '../../infrastructure/models/new-chat-thread-response.dto';
import { InAppChatThreadMessagesAuthorsStorage } from '../storages/in-app-chat-thread-messages-authors.storage';

@Injectable()
export class InAppChatModalControlApplicationService implements InAppChatModalControlPrimaryPort {

  constructor(@Inject(IN_APP_CHAT_THREAD_SECONDARY_PORT) private chatThreadSecondaryPort: InAppChatThreadSecondaryPort,
    @Inject(IN_APP_CHAT_NOTIFICATION_POPUP_PRIMARY_PORT) private notificationPopupPrimaryPort: InAppChatNotificationPopupPrimaryPort,
    @Inject(IN_APP_CHAT_MESSAGE_PRIMARY_PORT) private chatMessagePrimaryPort: InAppChatMessagePrimaryPort,
    @Inject(IN_APP_CHAT_NEW_CHAT_THREAD_COMMUNICATION_PRIMARY_PORT) private newChatThreadCommunicationPrimaryPort: InAppChatNewChatThreadCommunicationPrimaryPort,
    @Inject(IN_APP_CHAT_TWILIO_EVENT_HANDLER_PRIMARY_PORT) private chatLiveUpdatePrimaryPort: InAppChatTwilioEventHandlerPrimaryPort,
    @Inject(MODAL_PROVIDER) private modalProvider: ModalProvider,
    @Inject(SHOW_LOADING_POPUP) private showLoadingPopup: ShowLoadingPopup,
    @Inject(DISMISS_LOADING_POPUP) private readonly dismissLoadingPopup: DismissLoadingPopup,
    private chatThreadMessagesStorage: InAppChatThreadMessagesStorage,
    private chatThreadMessagesAuthorsStorage: InAppChatThreadMessagesAuthorsStorage) {
  }


  openExistingChat(threadId: string, title: string, startListeningChatThreadUpdates: boolean = false): void {
    this.showLoadingPopup.show('Loading data...');
    this.chatMessagePrimaryPort.loadChatThreadMessages(threadId)
      .pipe(
        finalize(() => this.dismissLoadingPopup.dismiss()),
        tap(() => {
          if (startListeningChatThreadUpdates) {
            this.chatLiveUpdatePrimaryPort.startProcessingChatThreadMessageAdded([threadId]);
          }
        }),
        switchMap(() => {
          return this.modalProvider.showModal$({
            component: InAppChatConversationWindowModalComponent,
            componentProps: {
              threadId: threadId,
              title: title
            }
          })
        })
      )
      .subscribe(() => {
        if (startListeningChatThreadUpdates) {
          this.chatLiveUpdatePrimaryPort.stopProcessingChatThreadMessageAdded();
          this.chatMessagePrimaryPort.clearStorageData();
        }
      });
  }

  openNewOrExistingChat(clinicianId: string, facilityId: string, title: string): void {
    this.showLoadingPopup.show('Searching for a chat thread...');
    this.chatThreadSecondaryPort.getChatThreadId(clinicianId, facilityId)
      .pipe(
        map((response: { threadId: string }) => response.threadId),
      )
      .subscribe({
        next: (threadId: string) => {
          this.dismissLoadingPopup.dismiss();
          if (!threadId) {
            this.openNewChat(clinicianId, facilityId, title);
          } else {
            this.openExistingChat(threadId, title, true);
          }
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
          this.dismissLoadingPopup.dismiss();
          this.notificationPopupPrimaryPort.showErrorAlert('Problem finding a suitable chat. Please try again latter.');
        }
      })
  }

  // private async showFacilityWelcomePage(job: JobsDetailModel, clinician: UserDataModel, scheduler: Scheduler, facilityName: string): Promise<void> {
  //   this.modalProvider.showModal$<boolean | undefined>({
  //     component: InAppChatFacilityWelcomeModalComponent,
  //     componentProps: {
  //       scheduler: scheduler,
  //       facilityName: facilityName
  //     }
  //   }).subscribe(data => {
  //     // check if clinician click to start new conversation
  //     if (data) {
  //       // this.openNewChat();
  //     }
  //   })
  // }

  private openNewChat(clinicianId: string, facilityId: string, title: string): void {
    const subscription = new Subscription();
    let newThreadId: string;
    this.modalProvider.showModal$<string>({
      component: InAppChatConversationWindowModalComponent,
      componentProps: {
        title: title
      }
    }).subscribe(() => {
      this.chatLiveUpdatePrimaryPort.stopProcessingChatThreadMessageAdded();
      this.chatMessagePrimaryPort.clearStorageData();
      subscription.unsubscribe();
    })
    subscription.add(
      this.newChatThreadCommunicationPrimaryPort.getCreateNewChatThreadAction()
        .pipe(
          take(1), // create new thread can happen only once in new chat thread modal
          tap(() => this.showLoadingPopup.show('Initializing new chat thread...')),
          switchMap(() => this.chatThreadSecondaryPort.createChatThread(clinicianId, facilityId)),
          finalize(() => this.dismissLoadingPopup.dismiss()),
        ).subscribe({
          next: (response: NewChatThreadResponseDTO) => {
            newThreadId = response.threadId;
            this.chatThreadMessagesAuthorsStorage.set(newThreadId, response.participants);
            this.chatThreadMessagesStorage.set(newThreadId, new GroupedChatMessage());
            this.chatLiveUpdatePrimaryPort.startProcessingChatThreadMessageAdded([newThreadId]);
            this.newChatThreadCommunicationPrimaryPort.setNewChatThreadId(newThreadId)
          },
          error: (error: HttpErrorResponse) => {
            console.log(error);
            this.notificationPopupPrimaryPort.showErrorAlert('Problem with initializing new chat thread. Please try again latter.');
          }
        })
    )
  }

}

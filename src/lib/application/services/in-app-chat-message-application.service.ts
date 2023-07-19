import { Inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, map, tap, catchError, throwError, of, delay } from 'rxjs';
import { ChatThreadRelatedToJobResponseMapper as ChatThreadMessagesResponseMapper } from '../domain-model-mappers/chat-thread-messages-response.mapper';
import { ChatThreadMessagesResponseDTO } from '../../infrastructure/models/chat-thread-messages-response.dto';
import { ChatThreadRelatedToJobResponse } from '../../domain/models/chat-thread-related-to-job-response';
import { InAppChatThreadMessagesAuthorsStorage } from '../storages/in-app-chat-thread-messages-authors.storage';
import { InAppChatThreadMessagesStorage } from '../storages/in-app-chat-thread-messages.storage';
import { ChatMessageAuthor } from '../../domain/models/chat-message-author';
import { IN_APP_CHAT_MESSAGE_SECONDARY_PORT, InAppChatMessageSecondaryPort } from '../../infrastructure/secondary-ports/in-app-chat-message-secondary.port';
import { GroupedChatMessage } from '../../domain/models/grouped-chat-message';
import { AllowedAttachments } from '../../domain/constants/allowed-attachments.constants';
import { InAppChatMessagePrimaryPort } from '../primary-ports/in-app-chat-message-primary.port';
import { IN_APP_CHAT_NOTIFICATION_POPUP_PRIMARY_PORT, InAppChatNotificationPopupPrimaryPort } from '../primary-ports/in-app-chat-notification-popup-primary.port';


@Injectable()
export class InAppChatMessageApplicationService implements InAppChatMessagePrimaryPort {

  constructor(@Inject(IN_APP_CHAT_MESSAGE_SECONDARY_PORT) private chatMessageSecondaryPort: InAppChatMessageSecondaryPort,
    @Inject(IN_APP_CHAT_NOTIFICATION_POPUP_PRIMARY_PORT) private notificationPopupPrimaryPort: InAppChatNotificationPopupPrimaryPort,
    private chatThreadMessagesStorage: InAppChatThreadMessagesStorage,
    private chatThreadMessagesAuthorsStorage: InAppChatThreadMessagesAuthorsStorage) { }



  loadChatThreadMessages(threadId: string): Observable<ChatThreadRelatedToJobResponse> {
    if (this.chatThreadMessagesStorage.isThreadMessagesAreAlreadyLoaded(threadId)) {
      const messages: GroupedChatMessage = this.chatThreadMessagesStorage.getMessagesByThreadId(threadId);
      const authors: ChatMessageAuthor[] = this.chatThreadMessagesAuthorsStorage.getAuthorsByThreadId(threadId);

      return of(new ChatThreadRelatedToJobResponse(messages, authors))
        .pipe(delay(150)); // because show and hide loading popup happened to fast and popup is not dismissed
    } else {
      return this.chatMessageSecondaryPort.getChatThreadMessages(threadId)
        .pipe(
          map((response: ChatThreadMessagesResponseDTO) => ChatThreadMessagesResponseMapper.fromDTO(response)),
          tap((mappedResponse: ChatThreadRelatedToJobResponse) => {
            this.chatThreadMessagesStorage.set(threadId, mappedResponse.groupedMessages);
            this.chatThreadMessagesAuthorsStorage.set(threadId, mappedResponse.authors);
          })
        )
    }
  }

  getChatThreadMessages(threadId: string): Observable<GroupedChatMessage> {
    return this.chatThreadMessagesStorage.select(threadId);
  }

  getChatThreadMessagesAuthors(threadId: string): Observable<ChatMessageAuthor[]> {
    return this.chatThreadMessagesAuthorsStorage.select(threadId);
  }

  sendTextMessage(threadId: string, message: string): Observable<void> {
    return this.chatMessageSecondaryPort.sendTextMessage(threadId, message)
      .pipe(catchError((error: HttpErrorResponse) => {
        this.notificationPopupPrimaryPort.showErrorAlert('Error while sending the new message. Please try again latter.');
        return throwError(() => error);
      }))
  }

  sendMediaMessage(threadId: string, file: File): Observable<void> {
    if (!AllowedAttachments.includes(file.type)) {
      this.notificationPopupPrimaryPort.showErrorAlert('Please upload only image (JPEG, PNG, etc.) or PDF files.');
      return of();
    }

    return this.chatMessageSecondaryPort.sendMediaMessage(threadId, file)
      .pipe(catchError((error: HttpErrorResponse) => {
        this.notificationPopupPrimaryPort.showErrorAlert('Error while sending the new message. Please try again latter.');
        return throwError(() => error);
      }))
  }

  getUnreadMessagesCount(): Observable<number> {
    return this.chatMessageSecondaryPort.getUnreadMessagesCount()
      .pipe(map((response: { unreadMessagesCount: number }) => response.unreadMessagesCount));
  }

  clearStorageData(): void {
    this.chatThreadMessagesStorage.clear();
    this.chatThreadMessagesAuthorsStorage.clear();
  }
}

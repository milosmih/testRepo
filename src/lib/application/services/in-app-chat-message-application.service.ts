import { Inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, map, tap, catchError, throwError, of, delay, debounceTime, distinctUntilChanged } from 'rxjs';
import { ChatThreadMessagesResponseMapper as ChatThreadMessagesResponseMapper } from '../domain-model-mappers/chat-thread-messages-response.mapper';
import { ChatThreadMessagesResponseDTO } from '../../infrastructure/models/chat-thread-messages-response.dto';
import { ChatThreadMessagesResponse } from '../../domain/models/chat-thread-messages-response';
import { InAppChatThreadMessagesAuthorsStorage } from '../storages/in-app-chat-thread-messages-authors.storage';
import { InAppChatThreadMessagesStorage } from '../storages/in-app-chat-thread-messages.storage';
import { ChatMessageAuthor } from '../../domain/models/chat-message-author';
import { IN_APP_CHAT_MESSAGE_SECONDARY_PORT, InAppChatMessageSecondaryPort } from '../../infrastructure/secondary-ports/in-app-chat-message-secondary.port';
import { GroupedChatMessage } from '../../domain/models/grouped-chat-message';
import { AllowedAttachmentImages, AllowedAttachments } from '../../domain/constants/allowed-attachments.constants';
import { InAppChatMessagePrimaryPort } from '../primary-ports/in-app-chat-message-primary.port';
import { IN_APP_CHAT_NOTIFICATION_POPUP_PRIMARY_PORT, InAppChatNotificationPopupPrimaryPort } from '../primary-ports/in-app-chat-notification-popup-primary.port';
import { InAppChatThreadUnreadMessagesStatsStorage } from '../storages/in-app-chat-thread-unread-messages-stats.storage';
import { IN_APP_CHAT_TWILIO_MESSAGE_SECONDARY_PORT, InAppChatTwilioMessageSecondaryPort } from '../../infrastructure/secondary-ports/in-app-chat-twilio-message-secondary.port';
import { ChatThreadUnreadMessages } from '../../domain/models/chat-thread-unread-messages';


@Injectable()
export class InAppChatMessageApplicationService implements InAppChatMessagePrimaryPort {

  constructor(@Inject(IN_APP_CHAT_MESSAGE_SECONDARY_PORT) private chatMessageSecondaryPort: InAppChatMessageSecondaryPort,
    @Inject(IN_APP_CHAT_NOTIFICATION_POPUP_PRIMARY_PORT) private notificationPopupPrimaryPort: InAppChatNotificationPopupPrimaryPort,
    @Inject(IN_APP_CHAT_TWILIO_MESSAGE_SECONDARY_PORT) private twilioMessageSecondaryPort: InAppChatTwilioMessageSecondaryPort,
    private chatThreadMessagesStorage: InAppChatThreadMessagesStorage,
    private chatThreadMessagesAuthorsStorage: InAppChatThreadMessagesAuthorsStorage,
    private chatThreadUnreadMessageCountStorage: InAppChatThreadUnreadMessagesStatsStorage) { }



  loadChatThreadMessages(threadId: string): Observable<ChatThreadMessagesResponse> {
    if (this.chatThreadMessagesStorage.isThreadMessagesAreAlreadyLoaded(threadId)) {
      const messages: GroupedChatMessage = this.chatThreadMessagesStorage.getMessagesByThreadId(threadId);
      const authors: ChatMessageAuthor[] = this.chatThreadMessagesAuthorsStorage.getAuthorsByThreadId(threadId);

      return of(new ChatThreadMessagesResponse(messages, authors))
        .pipe(delay(150)); // because show and hide loading popup happened to fast and popup is not dismissed
    } else {
      return this.chatMessageSecondaryPort.getChatThreadMessages(threadId)
        .pipe(
          map((response: ChatThreadMessagesResponseDTO) => ChatThreadMessagesResponseMapper.fromDTO(response)),
          tap((mappedResponse: ChatThreadMessagesResponse) => {
            this.chatThreadMessagesStorage.set(threadId, mappedResponse.groupedMessages);
            this.chatThreadMessagesAuthorsStorage.set(threadId, mappedResponse.authors);
          })
        )
    }
  }

  getChatThreadMessages(threadId: string): Observable<GroupedChatMessage> {
    // if new thread is open it still does not have id
    if (!threadId) {
      return of({});
    }
    return this.chatThreadMessagesStorage.select(threadId);
  }

  getChatThreadMessagesAuthors(threadId: string): Observable<ChatMessageAuthor[]> {
    // if new thread is open it still does not have id
    if (!threadId) {
      return of([]);
    }
    return this.chatThreadMessagesAuthorsStorage.select(threadId);
  }

  sendTextMessage(threadId: string, message: string): Observable<number> {
    return this.twilioMessageSecondaryPort.sendTextMessage(threadId, message)
      .pipe(catchError((error: HttpErrorResponse) => {
        this.notificationPopupPrimaryPort.showErrorAlert('Error while sending the new message. Please try again latter.');
        return throwError(() => error);
      }))
  }

  sendMediaMessage(threadId: string, file: File): Observable<number> {
    if (!AllowedAttachments.includes(file.type)) {
      this.notificationPopupPrimaryPort.showErrorAlert('Accepted files types are PDF, JPEG, and PNG. Please try again with a different file.');
      return of();
    }

    return this.twilioMessageSecondaryPort.sendMediaMessage(threadId, file)
      .pipe(catchError((error: HttpErrorResponse) => {
        this.notificationPopupPrimaryPort.showErrorAlert('Error while sending the new message. Please try again latter.');
        return throwError(() => error);
      }))
  }

  getAllChatThreadsUnreadMessagesCount(): Observable<number> {
    return this.chatThreadUnreadMessageCountStorage.select()
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        map((response: ChatThreadUnreadMessages[]) => {
        return response.reduce((result: number, unreadMessagesStats: ChatThreadUnreadMessages) => {
          return result + unreadMessagesStats.unreadMessagesCount;
        }, 0)
      }))
  }

  getChatThreadUnreadMessagesCount(threadId: string): Observable<number> {
    return this.chatThreadUnreadMessageCountStorage.select()
      .pipe(map((response: ChatThreadUnreadMessages[]) => {
        const messagesStats: ChatThreadUnreadMessages = response.find(messagesStats => messagesStats.threadId === threadId);
        if (!messagesStats) {
          return 0;
        }
        return messagesStats.unreadMessagesCount;
      }))
  }

  setAllMessagesRead(threadId: string): void {
    this.twilioMessageSecondaryPort.setAllMessagesRead(threadId);
  }

  getAllAttachmentTypes(): string {
    return AllowedAttachments.join(', ');
  }

  isMediaMessageAnImage(fileType: string): boolean {
    return AllowedAttachmentImages.includes(fileType);
  }

  getMediaMessageTemporaryUrl(messageId: string): Observable<string> {
    return this.twilioMessageSecondaryPort.getMediaMessageTemporaryUrl(messageId);
  }

  clearStorageData(): void {
    this.chatThreadMessagesStorage.clear();
    this.chatThreadMessagesAuthorsStorage.clear();
  }
}

import { Inject, Injectable } from '@angular/core';
import { CancellablePromise, Client, Conversation } from '@twilio/conversations';
import { InAppChatTwilioMessageSecondaryPort } from '../secondary-ports/in-app-chat-twilio-message-secondary.port';
import { IN_APP_CHAT_TWILIO_THREAD_SECONDARY_PORT, InAppChatTwilioThreadSecondaryPort } from '../secondary-ports/in-app-chat-twilio-thread-secondary.port';
import { Observable, catchError, from, map, of, pipe, switchMap } from 'rxjs';
import { IN_APP_CHAT_TWILIO_CLIENT_SECONDARY_PORT, InAppChatTwilioClientSecondaryPort } from '../secondary-ports/in-app-chat-twilio-client-secondary.port';


@Injectable({ providedIn: 'root' })
export class TwilioWebSocketMessageService implements InAppChatTwilioMessageSecondaryPort {
  constructor(@Inject(IN_APP_CHAT_TWILIO_CLIENT_SECONDARY_PORT) private twilioClientSecondaryPort: InAppChatTwilioClientSecondaryPort,
    @Inject(IN_APP_CHAT_TWILIO_THREAD_SECONDARY_PORT) private twilioThreadSecondaryPort: InAppChatTwilioThreadSecondaryPort) {
  }

  sendTextMessage(threadId: string, message: string): Observable<number> {
    return this.twilioThreadSecondaryPort.getChatThread(threadId)
      .pipe(
        switchMap((conversation: Conversation) => {
          return conversation.sendMessage(message);
        })
      )
  }

  sendMediaMessage(threadId: string, file: File): Observable<number> {
    return this.twilioThreadSecondaryPort.getChatThread(threadId)
      .pipe(
        switchMap((conversation: Conversation) => {
          const formData = new FormData();
          formData.append('media', file);

          return conversation.sendMessage(formData);
        })
      )
  }

  getMediaMessageTemporaryUrl(messageId: string): Observable<string> {
    return this.twilioClientSecondaryPort.getClient()
    .pipe(
      switchMap((client: Client) => {
        return from(client.getTemporaryContentUrlsForMediaSids([messageId]))
      }),
      map((urlMap: Map<string, string>) => {
        return urlMap.get(messageId);
      }),
      catchError(error => {
        console.error('Error retrieving media message TemporaryUrl:', error);
        return of(null);
      })
    );
  }

  setAllMessagesRead(threadId: string): void {
    this.twilioThreadSecondaryPort.getChatThread(threadId)
      .subscribe({
        next: (conversation: Conversation) => {
          conversation.setAllMessagesRead();
        }
      })
  }

}

import { Inject, Injectable } from '@angular/core';
import { Observable, catchError, from, of, switchMap, tap, throwError } from 'rxjs';
import { Client, Conversation } from '@twilio/conversations';
import { InAppChatTwilioThreadSecondaryPort } from '../secondary-ports/in-app-chat-twilio-thread-secondary.port';
import { IN_APP_CHAT_TWILIO_CLIENT_SECONDARY_PORT, InAppChatTwilioClientSecondaryPort } from '../secondary-ports/in-app-chat-twilio-client-secondary.port';


@Injectable({ providedIn: 'root' })
export class TwilioWebSocketChatThreadService implements InAppChatTwilioThreadSecondaryPort {
  private chatThreadsMap: Map<string, Conversation> = new Map<string, Conversation>();


  constructor(@Inject(IN_APP_CHAT_TWILIO_CLIENT_SECONDARY_PORT) private twilioClientSecondaryPort: InAppChatTwilioClientSecondaryPort) {
  }


  getChatThread(threadId: string): Observable<Conversation> {
    const findConversation: Conversation = this.chatThreadsMap.get(threadId);
    if (findConversation) {
      return of(findConversation);
    }
    return this.twilioClientSecondaryPort.getClient()
      .pipe(
        switchMap((client: Client) => {
          return from(client.getConversationBySid(threadId))
        }),
        tap((conversation: Conversation) => {
          if (!this.chatThreadsMap.has(conversation.sid)) {
            this.chatThreadsMap.set(conversation.sid, conversation);
          }
        }),
        catchError(error => {
          console.error('Error retrieving Twilio conversation:', error);
          return throwError(() => 'Error retrieving Twilio conversation.');
        })
      )
  }

  getAllCachedChatThreads(): Conversation[] {
    return Array.from(this.chatThreadsMap.values());
  }

  clearCachedData() {
    this.chatThreadsMap.clear();
  }
}

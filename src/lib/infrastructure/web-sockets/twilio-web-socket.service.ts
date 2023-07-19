import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client, Conversation, Message, State } from '@twilio/conversations';
import { Observable, of, switchMap, tap, Subject, forkJoin } from 'rxjs';
import { Env } from '@env';
import { InAppChatLiveUpdateSecondaryPort } from '../secondary-ports/in-app-chat-live-update-secondary.port';


@Injectable({ providedIn: 'root' })
export class TwilioWebSocketService implements InAppChatLiveUpdateSecondaryPort {
  private client: Client;
  private conversationChannelsMap: Map<string, Conversation> = new Map<string, Conversation>();
  private newMessage$: Subject<Message> = new Subject<Message>();

  constructor(
    private http: HttpClient,
    private readonly env: Env
  ) { 
    console.log('kreirana je jedna instanca TwilioWebSocketService servisa');

  }

  startListeningChatThreadUpdates(threadIds: string[]): void {
    this.getClient(threadIds[0])
      .pipe(
        switchMap((client: Client) => {
          const observables: Promise<Conversation>[] = threadIds.map(threadId => client.getConversationBySid(threadId));
          return forkJoin(observables)
        })
      ).subscribe({
        next: (conversations: Conversation[]) => {
          conversations.forEach(conversation => {
            if (!this.conversationChannelsMap.has(conversation.sid)) {
              this.conversationChannelsMap.set(conversation.sid, conversation);
              conversation.on('messageAdded', this.newMessageHandler);
            }
          })
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
        }
      })
  }

  stopListeningChatThreadUpdates(): void {
    this.conversationChannelsMap.forEach((conversation: Conversation, threadId: string) => {
      conversation.off('messageAdded', this.newMessageHandler);
    });
    this.conversationChannelsMap.clear();
  }

  getNewMessage(): Observable<Message> {
    return this.newMessage$.asObservable();
  }

  private newMessageHandler = (message: Message) => {
    console.log('@@@@@@@@@@@@ New messages: ', message);
    this.newMessage$.next(message);
  }

  private getClient(threadId: string): Observable<Client> {
    // cashing client value for reuse
    if (this.client) {
      return of(this.client);
    } else {
      return this.getToken(threadId)
        .pipe(
          switchMap(token => {
            return this.createClient(token);
          }),
          tap(client => {
            this.client = client;
            this.addTokenExpirationEvents(this.client, threadId);
          })
        )
    }
  }

  private createClient(token: string): Observable<Client> {
    return new Observable(observer => {
      const client = new Client(token, { logLevel: 'error' });

      client.on('stateChanged', (state: State) => {
        if (state === 'initialized') {
          observer.next(client);
        } else {
          observer.error(client);
        }
        observer.complete();
      });
    });
  }

  private addTokenExpirationEvents(client: Client, threadId: string): void {
    client.on('tokenAboutToExpire', async () => {
      console.log('In app chat token about to expire');
      this.getToken(threadId).subscribe(newToken => client.updateToken(newToken));
    });

    client.on('tokenExpired', async () => {
      console.log('In app chat token expired');
      this.getToken(threadId).subscribe(newToken => client.updateToken(newToken));
    });
  }

  private getToken(channelId: string): Observable<string> {
    return this.http.post<string>(`${this.env.APIurl}twilio/token`, { channelId });
  }

}

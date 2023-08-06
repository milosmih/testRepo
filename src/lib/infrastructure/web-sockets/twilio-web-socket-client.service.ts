import { Inject, Injectable } from '@angular/core';
import { Observable, catchError, of, shareReplay, switchMap, tap, throwError } from 'rxjs';
import { Client, State } from '@twilio/conversations';
import { IN_APP_CHAT_TWILIO_AUTH_SECONDARY_PORT, InAppChatTwilioAuthSecondaryPort } from '../secondary-ports/in-app-chat-twilio-auth-secondary.port';
import { InAppChatTwilioClientSecondaryPort } from '../secondary-ports/in-app-chat-twilio-client-secondary.port';


@Injectable({ providedIn: 'root' })
export class TwilioWebSocketClientService implements InAppChatTwilioClientSecondaryPort {
  private client: Client;

  constructor(@Inject(IN_APP_CHAT_TWILIO_AUTH_SECONDARY_PORT) private twilioAuthSecondaryPort: InAppChatTwilioAuthSecondaryPort) {
  }

  getClient(): Observable<Client> {
    // cashing client value for reuse
    if (this.client) {
      return of(this.client);
    } else {
      return this.twilioAuthSecondaryPort.getToken()
        .pipe(
          switchMap((token: { token: string }) => {
            return this.createClient(token.token)
              .pipe(
                catchError(error => {
                  console.error('Error creating Twilio client:', error);
                  return throwError(() => 'Error creating Twilio client.');
                })
              );
          }),
          tap(client => {
            this.client = client;
            this.addTokenExpirationEvents(this.client);
          }),
          catchError(error => {
            console.error('Error getting Twilio token:', error);
            return throwError(() => 'Error creating Twilio client.');
          }),
          shareReplay(1)
        )
    }
  }

  destroyClient(): void {
    this.client?.shutdown();
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

  private addTokenExpirationEvents(client: Client): void {
    client.on('tokenAboutToExpire', async () => {
      console.log('In app chat token about to expire');
      this.updateToken(client);
    });

    client.on('tokenExpired', async () => {
      console.log('In app chat token expired');
      this.updateToken(client);
    });
  }

  private updateToken(client: Client) {
    this.twilioAuthSecondaryPort.getToken()
      .subscribe({
        next: (newToken) => { client.updateToken(newToken.token) },
        error: (error) => { console.error('Error getting Twilio token:', error) }
      })
  }

}

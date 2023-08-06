import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Env } from '@env';
import { InAppChatTwilioAuthSecondaryPort } from '../secondary-ports/in-app-chat-twilio-auth-secondary.port';

@Injectable({ providedIn: 'root' })
export class HttpInAppChatTwilioAuthService implements InAppChatTwilioAuthSecondaryPort {

  constructor(
    private http: HttpClient,
    private readonly env: Env
  ) { }

  getToken(): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.env.APIurl}twilio/new-token`, null);
  }
}

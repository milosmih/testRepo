import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Env } from '@env';
import { InAppChatMigrationSecondaryPort } from '../secondary-ports/in-app-chat-migration-secondary.port';

@Injectable({ providedIn: 'root' })
export class HttpInAppChatMigrationService implements InAppChatMigrationSecondaryPort {

  constructor(
    private http: HttpClient,
    private readonly env: Env
  ) {}


  getChatThreadsDataAnalysis(): Observable<string> {
    return this.http.get<string>(`${this.env.APIurl}twilio/chat-threads-data-analysis`);
  }

  exportChatThreads(): Observable<string> {
    return this.http.post<string>(`${this.env.APIurl}twilio/export-chat-threads`, null);
  }

  exportChatThreadsAttributes(): Observable<string> {
    return this.http.post<string>(`${this.env.APIurl}twilio/export-all-chats-attributes-data`, null);
  }

  updateChatThreadsWithFirestoreMetaData(): Observable<string> {
    return this.http.post<string>(`${this.env.APIurl}twilio/update-chat-threads-with-firestore-meta-data`, null);
  }

  updateChatThreadJobId(): Observable<string> {
    return this.http.post<string>(`${this.env.APIurl}twilio/update-threads-with-job`, null);
  }

  removeChatThread(threadId: string): Observable<string> {
    return this.http.delete<string>(`${this.env.APIurl}twilio/chat-thread/${threadId}`);
  }

  setInitialReadHorizonToParticipantChatThreads(): Observable<string> {
    return this.http.post<string>(`${this.env.APIurl}twilio/participant/read-horizon`, null);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Env } from '@env';
import { ClinicianChatThreadDTO, FacilityUserChatThreadDTO } from '../models/chat-thread.dto';
import { ChatThreadMessagesResponseDTO } from '../models/chat-thread-messages-response.dto';
import { InAppChatThreadSecondaryPort } from '../secondary-ports/in-app-chat-thread-secondary.port';
import { InAppChatMessageSecondaryPort } from '../secondary-ports/in-app-chat-message-secondary.port';

@Injectable({ providedIn: 'root' })
export class HttpInAppChatService implements InAppChatThreadSecondaryPort, InAppChatMessageSecondaryPort {

  constructor(
    private http: HttpClient,
    private readonly env: Env
  ) { }

  getClinicianChatThreads(): Observable<ClinicianChatThreadDTO[]> {
    return this.http.get<ClinicianChatThreadDTO[]>(`${this.env.APIurl}twilio/clinician-chat-threads`);
  }

  getFacilityUserChatThreads(): Observable<FacilityUserChatThreadDTO[]> {
    return this.http.get<FacilityUserChatThreadDTO[]>(`${this.env.APIurl}twilio/facility-user-chat-threads`);
  }

  getChatThreadMessages(threadId: string): Observable<ChatThreadMessagesResponseDTO> {
    return this.http.get<ChatThreadMessagesResponseDTO>(`${this.env.APIurl}twilio/chat-thread-messages/${threadId}`);
  }

  sendTextMessage(threadId: string, message: string): Observable<void> {
    const data = { threadId, message }
    return this.http.post<any>(`${this.env.APIurl}twilio/message`, data);
  }

  sendMediaMessage(threadId: string, file: File): Observable<void> {
    const data = { threadId, file }
    return this.http.post<any>(`${this.env.APIurl}twilio/message`, data);
  }

  getChatThreadId(clinicianId: string, facilityId: string): Observable<{ threadId: string }> {
    return this.http.get<{ threadId: string }>(`${this.env.APIurl}twilio/chat-thread/clinician/${clinicianId}/facility/${facilityId}`);
  }

  createChatThread(clinicianId: string, facilityId: string): Observable<{ threadId: string }> {
    return this.http.post<{ threadId: string }>(`${this.env.APIurl}twilio/chat-thread`, { clinicianId, facilityId });
  }

  getUnreadMessagesCount(): Observable<{ unreadMessagesCount: number }> {
    return this.http.get<{ unreadMessagesCount: number }>(`${this.env.APIurl}twilio/unread-messages-count`);
  }

}

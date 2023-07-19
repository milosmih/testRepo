import { Observable } from "rxjs";
import { InjectionToken } from "@angular/core";
import { ChatThreadMessagesResponseDTO } from "../models/chat-thread-messages-response.dto";

export const IN_APP_CHAT_MESSAGE_SECONDARY_PORT: InjectionToken<InAppChatMessageSecondaryPort> = new InjectionToken(
  'IN_APP_CHAT_MESSAGE_SECONDARY_PORT'
);

export interface InAppChatMessageSecondaryPort {

  getChatThreadMessages(threadId: string): Observable<ChatThreadMessagesResponseDTO>;

  sendTextMessage(threadId: string, message: string): Observable<void>;

  sendMediaMessage(threadId: string, file: File): Observable<void>;

  getUnreadMessagesCount(): Observable<{ unreadMessagesCount: number }>;
}

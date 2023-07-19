import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";
import { GroupedChatMessage } from "../../domain/models/grouped-chat-message";
import { ChatMessageAuthor } from "../../domain/models/chat-message-author";
import { ChatThreadRelatedToJobResponse } from "../../domain/models/chat-thread-related-to-job-response";

export const IN_APP_CHAT_MESSAGE_PRIMARY_PORT: InjectionToken<InAppChatMessagePrimaryPort> = new InjectionToken(
  'IN_APP_CHAT_MESSAGE_PRIMARY_PORT'
);

export interface InAppChatMessagePrimaryPort {

  loadChatThreadMessages(threadId: string): Observable<ChatThreadRelatedToJobResponse>;

  getChatThreadMessages(threadId: string): Observable<GroupedChatMessage>;

  getChatThreadMessagesAuthors(threadId: string): Observable<ChatMessageAuthor[]>;

  sendTextMessage(threadId: string, message: string): Observable<void>;

  sendMediaMessage(threadId: string, file: File): Observable<void>;

  getUnreadMessagesCount(): Observable<number>;

  clearStorageData(): void;

}

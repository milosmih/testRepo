import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";
import { GroupedChatMessage } from "../../domain/models/grouped-chat-message";
import { ChatMessageAuthor } from "../../domain/models/chat-message-author";
import { ChatThreadMessagesResponse } from "../../domain/models/chat-thread-messages-response";

export const IN_APP_CHAT_MESSAGE_PRIMARY_PORT: InjectionToken<InAppChatMessagePrimaryPort> = new InjectionToken(
  'IN_APP_CHAT_MESSAGE_PRIMARY_PORT'
);

export interface InAppChatMessagePrimaryPort {

  loadChatThreadMessages(threadId: string): Observable<ChatThreadMessagesResponse>;

  getChatThreadMessages(threadId: string): Observable<GroupedChatMessage>;

  getChatThreadMessagesAuthors(threadId: string): Observable<ChatMessageAuthor[]>;

  sendTextMessage(threadId: string, message: string): Observable<number>;

  sendMediaMessage(threadId: string, file: File): Observable<number>;

  getAllChatThreadsUnreadMessagesCount(): Observable<number>;

  getChatThreadUnreadMessagesCount(threadId: string): Observable<number>;

  setAllMessagesRead(threadId: string): void;

  getAllAttachmentTypes(): string;

  isMediaMessageAnImage(fileType: string): boolean;

  getMediaMessageTemporaryUrl(messageId: string): Observable<string>

  clearStorageData(): void;

}
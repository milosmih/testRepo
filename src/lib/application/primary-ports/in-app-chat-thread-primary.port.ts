import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";
import { ChatThread } from "../../domain/models/chat-thread";

export const IN_APP_CHAT_THREAD_PRIMARY_PORT: InjectionToken<InAppChatThreadPrimaryPort> = new InjectionToken(
  'IN_APP_CHAT_THREAD_PRIMARY_PORT'
);

export interface InAppChatThreadPrimaryPort {

  loadChatThreads(): void;

  getChatThreads(): Observable<ChatThread[]>;

  getChatThreadsLoading(): Observable<boolean>;
}

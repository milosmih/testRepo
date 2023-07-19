import { InjectionToken } from "@angular/core";
import { Observable } from 'rxjs';

export const IN_APP_CHAT_NEW_CHAT_THREAD_COMMUNICATION_PRIMARY_PORT: InjectionToken<InAppChatNewChatThreadCommunicationPrimaryPort> = new InjectionToken(
  'IN_APP_CHAT_NEW_CHAT_THREAD_COMMUNICATION_PRIMARY_PORT'
);

export interface InAppChatNewChatThreadCommunicationPrimaryPort {

  getCreateNewChatThreadAction(): Observable<void>;

  fireCreateNewChatThreadAction(): void;

  getNewChatThreadId(): Observable<string>;

  setNewChatThreadId(threadId: string): void;
    
}
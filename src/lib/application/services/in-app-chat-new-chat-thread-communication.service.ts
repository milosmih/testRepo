import { Observable, Subject } from 'rxjs';
import { InAppChatNewChatThreadCommunicationPrimaryPort } from '../primary-ports/in-app-chat-new-chat-thread-communication-primary.port';

export class InAppChatNewChatThreadCommunicationService implements InAppChatNewChatThreadCommunicationPrimaryPort {
  private createNewChatThreadAction$: Subject<void> = new Subject<void>();
  private newChatThreadId$: Subject<string> = new Subject<string>();


  getCreateNewChatThreadAction(): Observable<void> {
    return this.createNewChatThreadAction$.asObservable();
  }

  fireCreateNewChatThreadAction(): void {
    this.createNewChatThreadAction$.next();
  }

  getNewChatThreadId(): Observable<string> {
    return this.newChatThreadId$.asObservable();
  }

  setNewChatThreadId(threadId: string): void {
    this.newChatThreadId$.next(threadId);
  }
}

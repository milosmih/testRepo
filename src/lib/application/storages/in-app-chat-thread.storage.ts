import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatThread } from '../../domain/models/chat-thread';

@Injectable({ providedIn: 'root' })
export class InAppChatThreadStorage {
  private chatThreads$: BehaviorSubject<ChatThread[]> = new BehaviorSubject<ChatThread[]>([]);

  select(): Observable<ChatThread[]> {
    return this.chatThreads$.asObservable();
  }

  set(state: ChatThread[]): void {
    this.chatThreads$.next(state);
  }

  patch(threadId: string, newMessage: any): void {
    const chatThreads: ChatThread[] = this.chatThreads$.value;
    const findThreadIndex = chatThreads.findIndex(thread => thread.threadId === threadId);
    if (findThreadIndex !== -1) {
      const findThread: ChatThread = chatThreads[findThreadIndex];
      const newUpdatedThread: ChatThread = new ChatThread(
        findThread.threadId,
        newMessage,
        findThread.metadata,
        findThread.title,
        findThread.photoUrl
      );
      chatThreads.splice(findThreadIndex, 1)
      this.chatThreads$.next([newUpdatedThread, ...chatThreads]);
    }
  }

  clear(): void {
    this.chatThreads$.next([]);
  }

}

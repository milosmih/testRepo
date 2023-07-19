import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatMessageAuthor } from '../../domain/models/chat-message-author';

@Injectable({ providedIn: 'root' })
export class InAppChatThreadMessagesAuthorsStorage {
  private authorsMap: Map<string, BehaviorSubject<ChatMessageAuthor[]>> = new Map<string, BehaviorSubject<ChatMessageAuthor[]>>()

  select(threadId: string): Observable<ChatMessageAuthor[]> {
    return this.authorsMap.get(threadId).asObservable();
  }

  set(threadId: string, state: ChatMessageAuthor[]): void {
    const newChatThreadAuthors: BehaviorSubject<ChatMessageAuthor[]> = new BehaviorSubject<ChatMessageAuthor[]>(state);
    this.authorsMap.set(threadId, newChatThreadAuthors);
  }

  clear(): void {
    this.authorsMap.clear();
  }

  getAuthorsByThreadId(threadId: string): ChatMessageAuthor[] {
    return this.authorsMap.get(threadId).value;
  }

}

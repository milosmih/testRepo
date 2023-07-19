import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatMessage, GroupedChatMessage } from '../../domain/models/grouped-chat-message';

@Injectable({ providedIn: 'root' })
export class InAppChatThreadMessagesStorage {
  private groupedMessagesMap: Map<string, BehaviorSubject<GroupedChatMessage>> = new Map<string, BehaviorSubject<GroupedChatMessage>>()

  select(threadId: string): Observable<GroupedChatMessage> {
    return this.groupedMessagesMap.get(threadId).asObservable();
  }

  set(threadId: string, state: GroupedChatMessage): void {
    const newChatThreadMessagesGroup: BehaviorSubject<GroupedChatMessage> = new BehaviorSubject<GroupedChatMessage>(state);
    this.groupedMessagesMap.set(threadId, newChatThreadMessagesGroup);
  }

  patch(threadId: string, newMessage: ChatMessage): void {
    if (this.isThreadMessagesAreAlreadyLoaded(threadId)) {
      const chatThreadMessagesGroupForUpdate: BehaviorSubject<GroupedChatMessage> = this.groupedMessagesMap.get(threadId);
      const messages: GroupedChatMessage = chatThreadMessagesGroupForUpdate.value;

      const groupedDate: string = this.getGroupedDate(newMessage.lastUpdateTime);
      if (!messages[groupedDate]) {
        messages[groupedDate] = [];
      }
      messages[groupedDate].push(newMessage);

      chatThreadMessagesGroupForUpdate.next({ ...messages });
    }
  }

  clear(): void {
    this.groupedMessagesMap.clear();
  }

  getMessagesByThreadId(threadId: string): GroupedChatMessage {
    return this.groupedMessagesMap.get(threadId).value;
  }

  isThreadMessagesAreAlreadyLoaded(threadId: string): boolean {
    return !!this.groupedMessagesMap.get(threadId);
  }

  private getGroupedDate(date: string): string {
    const groupedDate: Date = new Date(date);

    const day = groupedDate.getDate().toString().padStart(2, '0');
    const month = (groupedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = groupedDate.getFullYear();

    return `${year}/${month}/${day}`;
  }

}

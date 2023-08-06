import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatThreadUnreadMessages } from '../../domain/models/chat-thread-unread-messages';

@Injectable({ providedIn: 'root' })
export class InAppChatThreadUnreadMessagesStatsStorage {
  private unreadMessagesStatsMap: BehaviorSubject<ChatThreadUnreadMessages[]> = new BehaviorSubject<ChatThreadUnreadMessages[]>([]);

  select(): Observable<ChatThreadUnreadMessages[]> {
    return this.unreadMessagesStatsMap.asObservable();
  }

  set(state: ChatThreadUnreadMessages[]): void {
    this.unreadMessagesStatsMap.next([...state]);
  }

  patch(state: ChatThreadUnreadMessages): void {
    const findIndex = this.unreadMessagesStatsMap.value.findIndex(messagesStats => messagesStats.threadId === state.threadId);
    if (findIndex > -1) {
      this.unreadMessagesStatsMap.value.splice(findIndex, 1);
    }
    this.unreadMessagesStatsMap.next([state, ...this.unreadMessagesStatsMap.value]);
  }
  
}


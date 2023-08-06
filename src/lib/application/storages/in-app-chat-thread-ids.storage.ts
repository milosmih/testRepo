import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InAppChatThreadIdsStorage {
  private chatThreadsIds$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  select(): Observable<string[]> {
    return this.chatThreadsIds$.asObservable();
  }

  set(state: string[]): void {
    this.chatThreadsIds$.next(state);
  }

  patch(threadId: string): void {
    if(!this.chatThreadsIds$.value.includes(threadId)) {
      this.chatThreadsIds$.next([threadId, ...this.chatThreadsIds$.value]);
    }
  }

}

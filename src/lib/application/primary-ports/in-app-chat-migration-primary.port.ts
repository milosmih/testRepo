import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";

export const IN_APP_CHAT_MIGRATION_PRIMARY_PORT: InjectionToken<InAppChatMigrationPrimaryPort> = new InjectionToken(
  'IN_APP_CHAT_MIGRATION_PRIMARY_PORT'
);

export interface InAppChatMigrationPrimaryPort {

  getChatThreadsDataAnalysis(): Observable<string>;

  exportChatThreads(): Observable<string>;

  exportChatThreadsAttributes(): Observable<string>;

  updateChatThreadsWithFirestoreMetaData(): Observable<string>;

  updateChatThreadJobId(): Observable<string>;

  removeChatThread(treadId: string): Observable<string>;

  setInitialReadHorizonToParticipantChatThreads(): Observable<string>;

}

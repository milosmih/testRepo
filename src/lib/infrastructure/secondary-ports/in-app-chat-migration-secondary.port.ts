import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";

export const IN_APP_CHAT_MIGRATION_SECONDARY_PORT: InjectionToken<InAppChatMigrationSecondaryPort> = new InjectionToken(
  'IN_APP_CHAT_MIGRATION_SECONDARY_PORT'
);

export interface InAppChatMigrationSecondaryPort {

  getChatThreadsDataAnalysis(): Observable<string>;

  exportChatThreads(): Observable<string>;

  exportChatThreadsAttributes(): Observable<string>;

  updateChatThreadsWithFirestoreMetaData(): Observable<string>;

  updateChatThreadJobId(): Observable<string>;
}

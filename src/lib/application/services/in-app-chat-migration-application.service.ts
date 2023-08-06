import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IN_APP_CHAT_MIGRATION_SECONDARY_PORT, InAppChatMigrationSecondaryPort } from '../../infrastructure/secondary-ports/in-app-chat-migration-secondary.port';
import { InAppChatMigrationPrimaryPort } from '../primary-ports/in-app-chat-migration-primary.port';

@Injectable()
export class InAppChatMigrationApplicationService implements InAppChatMigrationPrimaryPort {

  constructor(@Inject(IN_APP_CHAT_MIGRATION_SECONDARY_PORT) private migrationSecondaryPort: InAppChatMigrationSecondaryPort) { }

  getChatThreadsDataAnalysis(): Observable<string> {
    return this.migrationSecondaryPort.getChatThreadsDataAnalysis();
  }

  exportChatThreads(): Observable<string> {
    return this.migrationSecondaryPort.exportChatThreads();
  }

  exportChatThreadsAttributes(): Observable<string> {
    return this.migrationSecondaryPort.exportChatThreadsAttributes();
  }

  updateChatThreadsWithFirestoreMetaData(): Observable<string>{
    return this.migrationSecondaryPort.updateChatThreadsWithFirestoreMetaData();
  }

  updateChatThreadJobId(): Observable<string> {
    return this.migrationSecondaryPort.updateChatThreadJobId();
  }

  removeChatThread(threadId: string): Observable<string> {
    return this.migrationSecondaryPort.removeChatThread(threadId);
  }

  setInitialReadHorizonToParticipantChatThreads(): Observable<string> {
    return this.migrationSecondaryPort.setInitialReadHorizonToParticipantChatThreads();
  }
}

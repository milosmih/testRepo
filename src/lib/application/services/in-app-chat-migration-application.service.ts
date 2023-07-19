import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IN_APP_CHAT_MIGRATION_SECONDARY_PORT, InAppChatMigrationSecondaryPort } from '../../infrastructure/secondary-ports/in-app-chat-migration-secondary.port';
import { InAppChatMigrationPrimaryPort } from '../primary-ports/in-app-chat-migration-primary.port';

@Injectable()
export class InAppChatMigrationApplicationService implements InAppChatMigrationPrimaryPort {

  constructor(@Inject(IN_APP_CHAT_MIGRATION_SECONDARY_PORT) private inAppChatMigrationDtoPort: InAppChatMigrationSecondaryPort) { }

  getChatThreadsDataAnalysis(): Observable<string> {
    return this.inAppChatMigrationDtoPort.getChatThreadsDataAnalysis();
  }

  exportChatThreads(): Observable<string> {
    return this.inAppChatMigrationDtoPort.exportChatThreads();
  }

  exportChatThreadsAttributes(): Observable<string> {
    return this.inAppChatMigrationDtoPort.exportChatThreadsAttributes();
  }

  updateChatThreadsWithFirestoreMetaData(): Observable<string>{
    return this.inAppChatMigrationDtoPort.updateChatThreadsWithFirestoreMetaData();
  }

  updateChatThreadJobId(): Observable<string> {
    return this.inAppChatMigrationDtoPort.updateChatThreadJobId();
  }
}

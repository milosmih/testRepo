import { NgModule } from '@angular/core';
import { InAppChatMigrationApplicationService } from './in-app-chat-migration-application.service';
import { IN_APP_CHAT_MIGRATION_PRIMARY_PORT } from '../primary-ports/in-app-chat-migration-primary.port';
import { HttpInAppChatMigrationServiceModule } from '../../infrastructure/http-services/http-in-app-chat-migration.service.module';


@NgModule({
  imports: [
    HttpInAppChatMigrationServiceModule
  ],
  declarations: [],
  providers: [
    InAppChatMigrationApplicationService,
    { provide: IN_APP_CHAT_MIGRATION_PRIMARY_PORT, useExisting: InAppChatMigrationApplicationService }
  ],
  exports: []
})
export class InAppChatMigrationApplicationServiceModule {}

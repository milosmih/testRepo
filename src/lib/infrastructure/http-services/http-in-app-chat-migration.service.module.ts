import { NgModule } from '@angular/core';
import { HttpInAppChatMigrationService } from './http-in-app-chat-migration.service';
import { IN_APP_CHAT_MIGRATION_SECONDARY_PORT } from '../secondary-ports/in-app-chat-migration-secondary.port';

@NgModule({
  imports: [],
  declarations: [],
  providers: [
    { provide: IN_APP_CHAT_MIGRATION_SECONDARY_PORT, useExisting: HttpInAppChatMigrationService }
  ]
})
export class HttpInAppChatMigrationServiceModule { }


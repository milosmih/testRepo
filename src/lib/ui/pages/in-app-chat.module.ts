import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InAppChatMainPage } from './in-app-chat-main-page/in-app-chat-main.page';
import { ShiftDateTimeFormatPipe } from '../pipes/shift-date-time-format.pipe';
import { InAppChatMigrationControlsComponent } from '../components/in-app-chat-migration-controls/in-app-chat-migration-controls.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: InAppChatMainPage
      },
      {
        path: 'migration',
        component: InAppChatMigrationControlsComponent
      }
    ])
  ],
  providers:[ShiftDateTimeFormatPipe]

})
export class InAppChatModule { }

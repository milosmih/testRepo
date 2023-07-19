import { Component, Inject } from '@angular/core';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { finalize } from 'rxjs';
import { DISMISS_LOADING_POPUP, DismissLoadingPopup, SHOW_LOADING_POPUP, ShowLoadingPopup } from '@common';
import { NursaNavbarComponentModule } from 'src/app/components/nursa-navbar/nursa-navbar.component.module';
import { IN_APP_CHAT_MIGRATION_PRIMARY_PORT, InAppChatMigrationPrimaryPort } from '../../../application/primary-ports/in-app-chat-migration-primary.port';
import { InAppChatMigrationApplicationServiceModule } from '../../../application/services/in-app-chat-migration-application.service.module';
import { DismissLoadingPopupModule } from 'src/app/alert/dismiss-loading-popup.module';
import { LoadingPopupModule } from 'src/app/alert/loading-popup.module';
@Component({
  selector: 'in-app-chat-migration-controls',
  templateUrl: 'in-app-chat-migration-controls.component.html',
  styleUrls: ['in-app-chat-migration-controls.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    JsonPipe,
    IonicModule,
    DismissLoadingPopupModule,
    LoadingPopupModule,
    NursaNavbarComponentModule,
    InAppChatMigrationApplicationServiceModule
  ],
})
export class InAppChatMigrationControlsComponent {
  public actionMessage: string = '';
  public actionError: string = '';
  constructor(@Inject(IN_APP_CHAT_MIGRATION_PRIMARY_PORT) private chatMigrationPrimaryPort: InAppChatMigrationPrimaryPort,
    @Inject(SHOW_LOADING_POPUP) private showLoadingPopup: ShowLoadingPopup,
    @Inject(DISMISS_LOADING_POPUP) private readonly dismissLoadingPopup: DismissLoadingPopup) {
  }

  getChatThreadsDataAnalysis(): void {
    this.clearMessages();
    this.showLoadingPopup.show('Processing data...');
    this.chatMigrationPrimaryPort.getChatThreadsDataAnalysis()
      .pipe(finalize(() => this.dismissLoadingPopup.dismiss()))
      .subscribe({
        next: (response: string) => {
          this.actionMessage = JSON.stringify(response);
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
          this.actionError = JSON.stringify(error);
        }
      });
  };

  exportChatThreads(): void {
    this.clearMessages();
    this.showLoadingPopup.show('Processing data...');
    this.chatMigrationPrimaryPort.exportChatThreads()
      .pipe(finalize(() => this.dismissLoadingPopup.dismiss()))
      .subscribe({
        next: (response: string) => {
          this.actionMessage = JSON.stringify(response);
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
          this.actionError = JSON.stringify(error);
        }
      });
  }

  exportChatThreadsAttributes(): void {
    this.clearMessages();
    this.showLoadingPopup.show('Processing data...');
    this.chatMigrationPrimaryPort.exportChatThreadsAttributes()
      .pipe(finalize(() => this.dismissLoadingPopup.dismiss()))
      .subscribe({
        next: (response: string) => {
          this.actionMessage = JSON.stringify(response);
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
          this.actionError = JSON.stringify(error);
        }
      });
  }

  updateChatThreadsWithFirestoreMetaData(): void {
    this.clearMessages();
    this.showLoadingPopup.show('Processing data...');
    this.chatMigrationPrimaryPort.updateChatThreadsWithFirestoreMetaData()
      .pipe(finalize(() => this.dismissLoadingPopup.dismiss()))
      .subscribe({
        next: (response: string) => {
          this.actionMessage = JSON.stringify(response);
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
          this.actionError = JSON.stringify(error);
        }
      });
  }

  updateChatThreadJobId(): void {
    this.clearMessages();
    this.showLoadingPopup.show('Processing data...');
    this.chatMigrationPrimaryPort.updateChatThreadJobId()
      .pipe(finalize(() => this.dismissLoadingPopup.dismiss()))
      .subscribe({
        next: (response: string) => {
          this.actionMessage = JSON.stringify(response);
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
          this.actionError = JSON.stringify(error);
        }
      });
  }

  private clearMessages(): void {
    this.actionMessage = '';
    this.actionError = '';
  }
}

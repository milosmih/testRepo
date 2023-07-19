import { Inject, Injectable } from "@angular/core";
import { ALERT_PROVIDER, AlertProvider } from "@nursa/core/tokens";
import { InAppChatNotificationPopupPrimaryPort } from "../primary-ports/in-app-chat-notification-popup-primary.port";

@Injectable()
export class InAppChatNotificationPopupApplicationService implements InAppChatNotificationPopupPrimaryPort {

  constructor(@Inject(ALERT_PROVIDER) private alertProvider: AlertProvider) { 
  }

  showErrorAlert(errorMessage: string): void {
    this.alertProvider.presentAlert$({
      header: 'Error',
      message: errorMessage,
      buttons: ['OK']
    })
      .subscribe();
  }

}
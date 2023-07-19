import { InjectionToken } from "@angular/core";

export const IN_APP_CHAT_NOTIFICATION_POPUP_PRIMARY_PORT: InjectionToken<InAppChatNotificationPopupPrimaryPort> = new InjectionToken(
  'IN_APP_CHAT_NOTIFICATION_POPUP_PRIMARY_PORT'
);

export interface InAppChatNotificationPopupPrimaryPort {

  showErrorAlert(errorMessage: string): void;
    
}
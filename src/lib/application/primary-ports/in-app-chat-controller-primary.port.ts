import { InjectionToken } from "@angular/core";

export const IN_APP_CHAT_CONTROLLER_PRIMARY_PORT: InjectionToken<InAppChatControllerPrimaryPort> = new InjectionToken(
  'IN_APP_CHAT_CONTROLLER_PRIMARY_PORT'
);

export interface InAppChatControllerPrimaryPort {
  
  startChat(): void;

  stopChat(): void;
}

import { InjectionToken } from "@angular/core";

export const IN_APP_CHAT_CONTROLLER_SECONDARY_PORT: InjectionToken<InAppChatControllerSecondaryPort> = new InjectionToken(
  'IN_APP_CHAT_CONTROLLER_SECONDARY_PORT'
);

export interface InAppChatControllerSecondaryPort {
  
  startChat(): void;

  stopChat(): void;
}

import { InjectionToken } from "@angular/core";

export const IN_APP_CHAT_MODAL_CONTROL_PRIMARY_PORT: InjectionToken<InAppChatModalControlPrimaryPort> = new InjectionToken(
  'IN_APP_CHAT_MODAL_CONTROL_PRIMARY_PORT'
);

export interface InAppChatModalControlPrimaryPort {

  openExistingChat(threadId: string): void;

  openNewOrExistingChat(clinicianId: string, facilityId: string): void;

}
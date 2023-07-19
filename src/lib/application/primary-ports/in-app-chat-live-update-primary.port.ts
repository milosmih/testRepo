import { InjectionToken } from "@angular/core";

export const IN_APP_CHAT_LIVE_UPDATE_PRIMARY_PORT: InjectionToken<InAppChatLiveUpdatePrimaryPort> = new InjectionToken(
  'IN_APP_CHAT_LIVE_UPDATE_PRIMARY_PORT'
);

export interface InAppChatLiveUpdatePrimaryPort {
  
  startListeningChatThreadUpdates(threadIds: string[]): void;

  stopListeningChatThreadUpdates(): void;
}

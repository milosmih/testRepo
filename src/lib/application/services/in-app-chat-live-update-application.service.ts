import { Inject, Injectable } from '@angular/core';
import { USER_ID_PROVIDER, UserIdProvider } from '@nursa/core/tokens';
import { Subscription } from 'rxjs';
import { Message } from '@twilio/conversations';
import { IN_APP_CHAT_LIVE_UPDATE_SECONDARY_PORT, InAppChatLiveUpdateSecondaryPort } from '../../infrastructure/secondary-ports/in-app-chat-live-update-secondary.port';
import { InAppChatLiveUpdatePrimaryPort } from '../primary-ports/in-app-chat-live-update-primary.port';
import { InAppChatThreadMessagesStorage } from '../storages/in-app-chat-thread-messages.storage';
import { ChatMessageMapper } from '../domain-model-mappers/chat-message.mapper';
import { InAppChatThreadStorage } from '../storages/in-app-chat-thread.storage';


@Injectable({ providedIn: 'root' })
export class InAppChatLiveUpdateApplicationService implements InAppChatLiveUpdatePrimaryPort {

  private subscription: Subscription = new Subscription();

  constructor(@Inject(IN_APP_CHAT_LIVE_UPDATE_SECONDARY_PORT) private chatLiveUpdateSecondaryPort: InAppChatLiveUpdateSecondaryPort,
    @Inject(USER_ID_PROVIDER) private userIdPort: UserIdProvider,
    private chatThreadMessagesStorage: InAppChatThreadMessagesStorage,
    private chatThreadStorage: InAppChatThreadStorage) {
      console.log('kreirana je jedna instanca InAppChatLiveUpdateApplicationService servisa');
  }


  startListeningChatThreadUpdates(threadIds: string[]): void {
    this.chatLiveUpdateSecondaryPort.startListeningChatThreadUpdates(threadIds);
    this.listenForNewMessages();
  }

  stopListeningChatThreadUpdates(): void {
    this.chatLiveUpdateSecondaryPort.stopListeningChatThreadUpdates();
    this.subscription.unsubscribe();
  }

  private listenForNewMessages(): void {
    this.subscription.add(
      this.chatLiveUpdateSecondaryPort.getNewMessage()
        .subscribe((message: Message) => {
          this.chatThreadMessagesStorage.patch(message.conversation.sid, ChatMessageMapper.fromTwilioMessage(message, this.userIdPort.userId));
          this.chatThreadStorage.patch(message.conversation.sid, message);
        })
    );
  }

}

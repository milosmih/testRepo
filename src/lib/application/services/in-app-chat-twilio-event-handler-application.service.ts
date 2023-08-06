import { Inject, Injectable } from '@angular/core';
import { USER_ID_PROVIDER, UserIdProvider } from '@nursa/core/tokens';
import { Subscription, from } from 'rxjs';
import { Conversation, ConversationUpdateReason, Message } from '@twilio/conversations';
import { IN_APP_CHAT_TWILIO_EVENT_HANDLER_SECONDARY_PORT, InAppChatTwilioEventHandlerSecondaryPort } from '../../infrastructure/secondary-ports/in-app-chat-twilio-event-handler-secondary.port';
import { InAppChatTwilioEventHandlerPrimaryPort } from '../primary-ports/in-app-chat-twilio-event-handler-primary.port';
import { InAppChatThreadMessagesStorage } from '../storages/in-app-chat-thread-messages.storage';
import { ChatMessageMapper } from '../domain-model-mappers/chat-message.mapper';
import { InAppChatThreadStorage } from '../storages/in-app-chat-thread.storage';
import { InAppChatThreadUnreadMessagesStatsStorage } from '../storages/in-app-chat-thread-unread-messages-stats.storage';
import { ChatThreadUnreadMessages } from '../../domain/models/chat-thread-unread-messages';


@Injectable({ providedIn: 'root' })
export class InAppChatTwilioEventHandlerApplicationService implements InAppChatTwilioEventHandlerPrimaryPort {

  private messageSubscription: Subscription = new Subscription();
  private chatThreadSubscription: Subscription = new Subscription();


  constructor(@Inject(IN_APP_CHAT_TWILIO_EVENT_HANDLER_SECONDARY_PORT) private twilioEventHandlerSecondaryPort: InAppChatTwilioEventHandlerSecondaryPort,
    @Inject(USER_ID_PROVIDER) private userIdPort: UserIdProvider,
    private chatThreadMessagesStorage: InAppChatThreadMessagesStorage,
    private chatThreadStorage: InAppChatThreadStorage,
    private unreadMessagesStatsStorage: InAppChatThreadUnreadMessagesStatsStorage) {
  }

  startProcessingChatThreadMessageAdded(threadIds: string[]): void {
    this.twilioEventHandlerSecondaryPort.startListeningChatThreadMessageAdded(threadIds);
    this.processNewMessages();
  }

  stopProcessingChatThreadMessageAdded(): void {
    this.twilioEventHandlerSecondaryPort.stopListeningChatThreadMessageAdded();
    this.messageSubscription.unsubscribe();
  }

  startProcessingChatThreadUpdates(): void {
    this.processNewChatThreads();
    this.processRemovedChatThreads();
    this.processUpdatedChatThreads();
  }

  stopProcessingChatThreadUpdates(): void {
    this.chatThreadSubscription.unsubscribe();
  }

  private processNewChatThreads(): void {
    if (!this.chatThreadSubscription) {
      this.chatThreadSubscription = new Subscription();
    }
    this.chatThreadSubscription.add(
      this.twilioEventHandlerSecondaryPort.getNewChatThread()
        .subscribe((conversation: Conversation) => {
          this.updateStorageMessageCount(conversation);
        })
    );
  }

  private processRemovedChatThreads(): void {
    if (!this.chatThreadSubscription) {
      this.chatThreadSubscription = new Subscription();
    }
    this.chatThreadSubscription.add(
      this.twilioEventHandlerSecondaryPort.getRemovedChatThread()
        .subscribe((conversation: Conversation) => {
          // this.chatThreadMessagesStorage.patch(message.conversation.sid, ChatMessageMapper.fromTwilioMessage(message, this.userIdPort.userId));
          // this.chatThreadStorage.patch(message.conversation.sid, message);
        })
    );
  }

  private processUpdatedChatThreads(): void {
    if (!this.chatThreadSubscription) {
      this.chatThreadSubscription = new Subscription();
    }
    this.chatThreadSubscription.add(
      this.twilioEventHandlerSecondaryPort.getChatThreadUpdate()
        .subscribe((conversation: { conversation: Conversation; updateReasons: ConversationUpdateReason[]; }) => {
          if (conversation.updateReasons.includes('lastReadMessageIndex')) {
            this.updateStorageMessageCount(conversation.conversation);
          }
        })
    );
  }

  private processNewMessages(): void {
    this.messageSubscription.add(
      this.twilioEventHandlerSecondaryPort.getNewMessage()
        .subscribe((message: Message) => {
          this.chatThreadMessagesStorage.patch(message.conversation.sid, ChatMessageMapper.fromTwilioMessage(message, this.userIdPort.userId));
          this.chatThreadStorage.patch(message.conversation.sid, message);
        })
    );
  }

  private updateStorageMessageCount(conversation: Conversation) {
    from(conversation.getUnreadMessagesCount())
      .subscribe((count: number) => {
        this.unreadMessagesStatsStorage.patch(new ChatThreadUnreadMessages(conversation.sid, count));
      })
  }

}

import { HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Client, Conversation, Message, Participant, ConversationUpdateReason, ParticipantUpdateReason } from '@twilio/conversations';
import { Observable, Subject, forkJoin } from 'rxjs';
import { InAppChatTwilioEventHandlerSecondaryPort } from '../secondary-ports/in-app-chat-twilio-event-handler-secondary.port';
import { IN_APP_CHAT_TWILIO_CLIENT_SECONDARY_PORT, InAppChatTwilioClientSecondaryPort } from '../secondary-ports/in-app-chat-twilio-client-secondary.port';
import { IN_APP_CHAT_TWILIO_THREAD_SECONDARY_PORT, InAppChatTwilioThreadSecondaryPort } from '../secondary-ports/in-app-chat-twilio-thread-secondary.port';


@Injectable({ providedIn: 'root' })
export class TwilioWebSocketEventHandlerService implements InAppChatTwilioEventHandlerSecondaryPort {
  private messageAdded$: Subject<Message> = new Subject<Message>();
  private participantJoined$: Subject<Participant> = new Subject<Participant>();
  private participantLeft$: Subject<Participant> = new Subject<Participant>();
  private participantUpdated$: Subject<Participant> = new Subject<Participant>();
  private conversationAdded$: Subject<Conversation> = new Subject<Conversation>();
  private conversationRemoved$: Subject<Conversation> = new Subject<Conversation>();
  private conversationUpdated$: Subject<{ conversation: Conversation; updateReasons: ConversationUpdateReason[]; }> = new Subject<{ conversation: Conversation; updateReasons: ConversationUpdateReason[]; }>();


  constructor(@Inject(IN_APP_CHAT_TWILIO_CLIENT_SECONDARY_PORT) private twilioClientSecondaryPort: InAppChatTwilioClientSecondaryPort,
    @Inject(IN_APP_CHAT_TWILIO_THREAD_SECONDARY_PORT) private twilioThreadSecondaryPort: InAppChatTwilioThreadSecondaryPort) {
  }

  startListeningChatThreadMessageAdded(threadIds: string[]): void {
    const observables: Observable<Conversation>[] = threadIds.map(threadId => this.twilioThreadSecondaryPort.getChatThread(threadId));
    
    forkJoin(observables).subscribe({
      next: (conversations: Conversation[]) => {
        conversations.forEach(conversation => {
          conversation.on('messageAdded', this.messageAddedHandler);
        })
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }

  stopListeningChatThreadMessageAdded(): void {
    this.twilioThreadSecondaryPort.getAllCachedChatThreads().forEach((conversation: Conversation) => {
      conversation.off('messageAdded', this.messageAddedHandler);
    });
    this.twilioThreadSecondaryPort.clearCachedData();
  }

  getNewMessage(): Observable<Message> {
    return this.messageAdded$.asObservable();
  }

  startListeningChatThreadParticipantUpdates(threadIds: string[]): void {
    const observables: Observable<Conversation>[] = threadIds.map(threadId => this.twilioThreadSecondaryPort.getChatThread(threadId));
    
    forkJoin(observables).subscribe({
        next: (conversations: Conversation[]) => {
          conversations.forEach(conversation => {
            conversation.on('participantJoined', this.participantJoinedHandler);
            conversation.on('participantLeft', this.participantLeftHandler);
            conversation.on('participantUpdated', this.participantUpdatedHandler);
          })
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
        }
      })
  }

  stopListeningChatThreadParticipantUpdates(): void {
    this.twilioClientSecondaryPort.getClient()
      .subscribe({
        next: (client: Client) => {
          client.off('participantJoined', this.participantJoinedHandler);
          client.off('participantLeft', this.participantLeftHandler);
          client.off('participantUpdated', this.participantUpdatedHandler);
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
        }
      })
  }

  startListeningChatThreadUpdates(): void {
    this.twilioClientSecondaryPort.getClient()
      .subscribe({
        next: (client: Client) => {
          client.on('conversationAdded', this.conversationAddedHandler);
          // client.on('conversationJoined', this.conversationJoinedHandler);
          client.on('conversationLeft', this.conversationLeftHandler);
          client.on('conversationRemoved', this.conversationRemovedHandler);
          client.on('conversationUpdated', this.conversationUpdatedHandler);
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
        }
      })
  }

  stopListeningChatThreadUpdates(): void {
    this.twilioClientSecondaryPort.getClient()
      .subscribe({
        next: (client: Client) => {
          client.off('conversationAdded', this.conversationAddedHandler);
          // client.off('conversationJoined', this.conversationJoinedHandler);
          client.off('conversationLeft', this.conversationLeftHandler);
          client.off('conversationRemoved', this.conversationRemovedHandler);
          client.off('conversationUpdated', this.conversationUpdatedHandler);
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
        }
      })
  }

  getNewChatThread(): Observable<Conversation> {
    return this.conversationAdded$.asObservable();
  }

  getRemovedChatThread(): Observable<Conversation> {
    return this.conversationRemoved$.asObservable();
  }

  getChatThreadUpdate(): Observable<{ conversation: Conversation; updateReasons: ConversationUpdateReason[]; }> {
    return this.conversationUpdated$.asObservable();
  }

  private messageAddedHandler = (message: Message) => {
    console.log('@@@@@@@@@@@@ messageAdded: ', message);
    this.messageAdded$.next(message);
  }

  private participantJoinedHandler = (participant: Participant) => {
    console.log('@@@@@@@@@@@@ participantJoined: ', participant);
    this.participantJoined$.next(participant);
  }

  private participantLeftHandler = (participant: Participant) => {
    console.log('@@@@@@@@@@@@ participantLeft: ', participant);
    this.participantLeft$.next(participant);
  }

  private participantUpdatedHandler = (participant: { participant: Participant; updateReasons: ParticipantUpdateReason[]; }) => {
    console.log('@@@@@@@@@@@@ participantUpdated: ', participant);
    this.participantUpdated$.next(participant.participant);
  }

  private conversationAddedHandler = (conversation: Conversation) => {
    this.conversationAdded$.next(conversation);
    console.log('@@@@@@@@@@@@ conversationAdded: ', conversation);
  }

  private conversationJoinedHandler = (conversation: Conversation) => {
    console.log('@@@@@@@@@@@@ conversationJoined: ', conversation);
  }

  private conversationLeftHandler = (conversation: Conversation) => {
    console.log('@@@@@@@@@@@@ conversationLeft: ', conversation);
  }

  private conversationRemovedHandler = (conversation: Conversation) => {
    this.conversationRemoved$.next(conversation);
    console.log('@@@@@@@@@@@@ conversationRemoved: ', conversation);
  }

  private conversationUpdatedHandler = (conversation: { conversation: Conversation; updateReasons: ConversationUpdateReason[]; }) => {
    this.conversationUpdated$.next(conversation);
    console.log('@@@@@@@@@@@@ conversationUpdated: ', conversation);
  }


}

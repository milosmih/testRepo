import { Component, ViewChild, ElementRef, Inject, Input, ChangeDetectorRef, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { AsyncPipe, DatePipe, KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { Observable, take, tap } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { TextareaInputFieldComponentModule } from '@nursa/ui-components';
import { InAppChatMessageComponent } from '../../components/in-app-chat-message/in-app-chat-message.component';
import { MessageAuthorPipe } from '../../pipes/message-author.pipe';
import { NursaNavbarComponentModule } from 'src/app/components/nursa-navbar/nursa-navbar.component.module';
import { IN_APP_CHAT_MESSAGE_PRIMARY_PORT, InAppChatMessagePrimaryPort } from '../../../application/primary-ports/in-app-chat-message-primary.port';
import { GroupedChatMessage } from '../../../domain/models/grouped-chat-message';
import { ChatMessageAuthor } from '../../../domain/models/chat-message-author';
import { IN_APP_CHAT_NEW_CHAT_THREAD_COMMUNICATION_PRIMARY_PORT, InAppChatNewChatThreadCommunicationPrimaryPort } from '../../../application/primary-ports/in-app-chat-new-chat-thread-communication-primary.port';

@Component({
  selector: 'app-in-app-chat-conversation-window-modal',
  templateUrl: 'in-app-chat-conversation-window-modal.component.html',
  styleUrls: ['in-app-chat-conversation-window-modal.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    MatIconModule,
    InAppChatMessageComponent,
    TextareaInputFieldComponentModule,
    NgFor,
    NgIf,
    AsyncPipe,
    KeyValuePipe,
    DatePipe,
    MessageAuthorPipe,
    ReactiveFormsModule,
    NursaNavbarComponentModule,
  ]
})
export class InAppChatConversationWindowModalComponent implements OnInit {
  @ViewChild('messagesContainerRef') private messagesContainer: ElementRef;
  @ViewChild('fileInputRef') fileInputRef: ElementRef;

  @Input() threadId: string;
  @Input() title: string;
  public groupedMessages$: Observable<GroupedChatMessage>;
  public authors$: Observable<ChatMessageAuthor[]>;

  public form: FormGroup = new FormGroup({
    message: new FormControl<string>('')
  });

  public allAttachmentTypes: string = this.chatMessagePrimaryPort.getAllAttachmentTypes();
  private lastSelectedFile: File;

  constructor(private cdr: ChangeDetectorRef,
    @Inject(IN_APP_CHAT_MESSAGE_PRIMARY_PORT) private chatMessagePrimaryPort: InAppChatMessagePrimaryPort,
    @Inject(IN_APP_CHAT_NEW_CHAT_THREAD_COMMUNICATION_PRIMARY_PORT) private newChatThreadCommunicationPrimaryPort: InAppChatNewChatThreadCommunicationPrimaryPort) {
  }

  ngOnInit(): void {
    if (this.isItNewChatThread()) {
      this.subscribeToNewChatThreadCreation();
    }

    this.initializeSubscriptions(this.threadId);
  }

  onClickSendNewTextMessage(): void {
    if (this.isItNewChatThread()) {
      this.newChatThreadCommunicationPrimaryPort.fireCreateNewChatThreadAction();
    } else {
      this.sendNewTextMessage(this.threadId, this.form.controls.message.value);
    }
  }

  onClickSendNewAttachment(): void {
    this.fileInputRef.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file: File | null = fileInput?.files?.[0] || null;
    if (file) {
      if (this.isItNewChatThread()) {
        this.lastSelectedFile = file;
        this.newChatThreadCommunicationPrimaryPort.fireCreateNewChatThreadAction();
      } else {
        this.sendNewMediaMessage(this.threadId, file);
      }
    }
  }

  private initializeSubscriptions(threadId: string): void {
    this.groupedMessages$ = this.chatMessagePrimaryPort.getChatThreadMessages(threadId)
      .pipe(tap(() => {
        this.cdr.detectChanges();
        this.scrollToBottomMessageContainer();
        this.chatMessagePrimaryPort.setAllMessagesRead(threadId);
      }))

    this.authors$ = this.chatMessagePrimaryPort.getChatThreadMessagesAuthors(threadId);
  }

  private scrollToBottomMessageContainer(): void {
    setTimeout(() => {
      if (this.messagesContainer?.nativeElement) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    }, 200);
  }
  // in case that we open new chat, we do not create chat until user send the first message
  // after it we create chat, wait for new chat Id and than send message to the thread
  private subscribeToNewChatThreadCreation(): void {
    this.newChatThreadCommunicationPrimaryPort.getNewChatThreadId()
      .pipe(take(1))
      .subscribe(threadId => {
        this.threadId = threadId;
        this.initializeSubscriptions(threadId);
        if (this.lastSelectedFile) {
          this.sendNewMediaMessage(this.threadId, this.lastSelectedFile);
        } else {
          this.sendNewTextMessage(this.threadId, this.form.controls.message.value);
        }
      })
  }

  private sendNewTextMessage(threadId: string, message: string) {
    this.chatMessagePrimaryPort.sendTextMessage(threadId, message)
      .subscribe({
        next: () => this.form.controls.message.setValue(''),
        error: (error: HttpErrorResponse) => console.log(error)
      })
  }

  private sendNewMediaMessage(threadId: string, file: File) {
    this.chatMessagePrimaryPort.sendMediaMessage(threadId, file)
      .subscribe({
        next: () => this.lastSelectedFile = null,
        error: (error: HttpErrorResponse) => console.log(error)
      })
  }

  private isItNewChatThread(): boolean {
    return !this.threadId;
  }

}

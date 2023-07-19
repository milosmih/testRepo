import { Component, Output, EventEmitter } from '@angular/core';
import { NgFor } from '@angular/common';


@Component({
  selector: 'app-in-app-chat-predefined-clinician-messages',
  templateUrl: 'in-app-chat-predefined-clinician-messages.component.html',
  styleUrls: ['in-app-chat-predefined-clinician-messages.component.scss'],
  standalone: true,
  imports: [NgFor],
})
export class InAppChatPredefinedClinicianMessagesComponent {
  @Output() selectedMessageChange: EventEmitter<string> = new EventEmitter<string>();
  
  public readonly messages: string[] = [
    `Can you give me parking instructions?`,
    `What charting system do you use?`,
    `What's the dress policy?`,
    `Can I work if I'm missing something on your list?`,
    `Will I have help or training?`
  ];

  public selectedMessage: string;

  onClickMessage(message: string) {
    this.selectedMessage = message;
    this.selectedMessageChange.next(message);
  }
}

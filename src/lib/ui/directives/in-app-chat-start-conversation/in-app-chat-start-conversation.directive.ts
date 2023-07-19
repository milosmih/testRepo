import { Directive, HostListener, Inject, Input } from '@angular/core';
import { IN_APP_CHAT_MODAL_CONTROL_PRIMARY_PORT, InAppChatModalControlPrimaryPort } from '../../../application/primary-ports/in-app-chat-modal-control-primary.port';

@Directive({
  selector: '[inAppChatStartConversation]'
})
export class InAppChatStartConversationDirective {
  @Input() clinicianId: string;
  @Input() facilityId: string;

  constructor(@Inject(IN_APP_CHAT_MODAL_CONTROL_PRIMARY_PORT) private chatModalControlPrimaryPort: InAppChatModalControlPrimaryPort) { }

  @HostListener('click')
  onClick(): void {
    this.chatModalControlPrimaryPort.openNewOrExistingChat(this.clinicianId, this.facilityId);
  }
}

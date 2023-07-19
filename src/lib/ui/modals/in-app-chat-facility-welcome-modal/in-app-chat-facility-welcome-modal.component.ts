import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AvatarComponentModule } from '@nursa/ui-components';
import { NursaNavbarComponentModule } from 'src/app/components/nursa-navbar/nursa-navbar.component.module';
import { ModalService } from 'src/app/modal.service';
import { Scheduler } from '../../../domain/models/scheduler';

@Component({
  selector: 'app-in-app-chat-facility-welcome-modal',
  templateUrl: 'in-app-chat-facility-welcome-modal.component.html',
  styleUrls: ['in-app-chat-facility-welcome-modal.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NursaNavbarComponentModule,
    AvatarComponentModule
  ],
})
export class InAppChatFacilityWelcomeModalComponent {
  @Input() scheduler: Scheduler;
  @Input() facilityName: string;

  constructor(private modalService: ModalService) {

  }

  onClickOpenNewMessageThread() {
    this.modalService.dismissModal(null, true)
  }
}

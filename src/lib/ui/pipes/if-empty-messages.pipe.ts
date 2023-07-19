import { Pipe, PipeTransform } from '@angular/core';
import { GroupedChatMessage } from '../../domain/models/grouped-chat-message';
@Pipe({
  name: 'ifEmptyMessages',
  standalone: true
})
export class IfEmptyMessagesPipe implements PipeTransform {

  transform(value: GroupedChatMessage): boolean {
    return !value || Object.keys(value).length === 0;
  }

}

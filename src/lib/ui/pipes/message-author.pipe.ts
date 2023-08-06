import { Pipe, PipeTransform } from '@angular/core';
import { ChatMessageAuthor } from '../../domain/models/chat-message-author';
@Pipe({
  name: 'messageAuthor',
  standalone: true
})
export class MessageAuthorPipe implements PipeTransform {
  transform(value: string, authorsList: ChatMessageAuthor[]): ChatMessageAuthor {   
    return authorsList.find(author => value === author.id);
  }

}

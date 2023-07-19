import { Pipe, PipeTransform } from '@angular/core';
import { ChatMessageAuthorDTO } from '../../infrastructure/models/chat-message-author.dto';
import { ChatMessageAuthor } from '../../domain/models/chat-message-author';
@Pipe({
  name: 'messageAuthor',
  standalone: true
})
export class MessageAuthorPipe implements PipeTransform {
  transform(value: string, authorsList: ChatMessageAuthorDTO[]): ChatMessageAuthor {   
    return authorsList.find(author => value === author.id);
  }

}

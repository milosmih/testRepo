import { ChatMessageAuthor } from "../../domain/models/chat-message-author";
import { ChatMessageAuthorDTO } from "../../infrastructure/models/chat-message-author.dto";

export class ChatMessageAuthorMapper {
  
  static fromDTO(dto: ChatMessageAuthorDTO): ChatMessageAuthor {
    return new ChatMessageAuthor(
      dto.id,
      dto.firstName,
      dto.lastName,
      dto.photoURL,
    )
  }
}

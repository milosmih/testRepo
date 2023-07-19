import { ChatMessageAuthorDTO } from './chat-message-author.dto';
import { GroupedChatMessageDTO } from './grouped-chat-message.dto';

export interface ChatThreadMessagesResponseDTO {
  readonly groupedMessages: GroupedChatMessageDTO;
  readonly authors: ChatMessageAuthorDTO[];
}
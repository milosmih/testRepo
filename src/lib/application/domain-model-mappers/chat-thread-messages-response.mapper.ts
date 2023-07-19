import { ChatThreadRelatedToJobResponse as ChatThreadMessagesResponse } from "../../domain/models/chat-thread-related-to-job-response";
import { ChatThreadMessagesResponseDTO } from "../../infrastructure/models/chat-thread-messages-response.dto";
import { ChatMessageAuthorMapper } from "./chat-message-author.mapper";
import { GroupedChatMessageMapper } from "./grouped-chat-message.mapper";

export class ChatThreadRelatedToJobResponseMapper {
  static fromDTO(dto: ChatThreadMessagesResponseDTO): ChatThreadMessagesResponse {
    return new ChatThreadMessagesResponse(
      GroupedChatMessageMapper.fromDTO(dto.groupedMessages),
      dto.authors.map(ChatMessageAuthorMapper.fromDTO),
    )
  }
}
  
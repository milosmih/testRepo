import { Message } from "@twilio/conversations";
import { ChatMessage } from "../../domain/models/grouped-chat-message";
import { ChatMessageDTO } from "../../infrastructure/models/grouped-chat-message.dto";

export class ChatMessageMapper {
  static fromDTO(dto: ChatMessageDTO): ChatMessage {
    return new ChatMessage(
      dto.authorId,
      dto.isSent,
      dto.body,
      dto.media,
      dto.lastUpdateTime,
      dto.index
    )
  }

  static fromTwilioMessage(twilioMessage: Message, loggedUserId: string): ChatMessage {
    return new ChatMessage(
      twilioMessage.author,
      twilioMessage.author === loggedUserId,
      twilioMessage.body,
      twilioMessage.attachedMedia,
      twilioMessage.dateUpdated.toISOString(),
      twilioMessage.index
    )
  }

}
import { GroupedChatMessage } from "../../domain/models/grouped-chat-message";
import { GroupedChatMessageDTO } from "../../infrastructure/models/grouped-chat-message.dto";
import { ChatMessageMapper } from "./chat-message.mapper";

export class GroupedChatMessageMapper {
  static fromDTO(dto: GroupedChatMessageDTO): GroupedChatMessage {
    const groupedChatMessage: GroupedChatMessage = {};

    for (const property in dto) {
      if (dto.hasOwnProperty(property)) {
        groupedChatMessage[property] = dto[property].map(ChatMessageMapper.fromDTO);
      }
    }
  
    return groupedChatMessage;
  }

}
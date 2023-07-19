import { ChatMessageAuthor } from "./chat-message-author";
import { GroupedChatMessage } from "./grouped-chat-message";

export class ChatThreadRelatedToJobResponse {
  constructor(
    readonly groupedMessages: GroupedChatMessage,
    readonly authors: ChatMessageAuthor[]
  ) { }
}
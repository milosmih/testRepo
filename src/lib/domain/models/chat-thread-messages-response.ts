import { ChatMessageAuthor } from "./chat-message-author";
import { GroupedChatMessage } from "./grouped-chat-message";

export class ChatThreadMessagesResponse {
  constructor(
    readonly groupedMessages: GroupedChatMessage,
    readonly authors: ChatMessageAuthor[]
  ) { }
}
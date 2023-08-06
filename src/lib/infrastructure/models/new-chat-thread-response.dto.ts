import { ChatThreadParticipantDTO } from "./chat-thread-participant.dto";

export interface NewChatThreadResponseDTO {
  threadId: string;
  participants: ChatThreadParticipantDTO[];
}
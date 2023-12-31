import { Media } from "@twilio/conversations";

export interface GroupedChatMessageDTO {
  readonly [key: string]: ChatMessageDTO[];
}

export interface ChatMessageDTO {
  readonly authorId: string; 
  readonly isSent: boolean;
  readonly body: string;
  readonly media: Media[];
  readonly lastUpdateTime: string;
  readonly index: number;
}
export interface GroupedChatMessageDTO {
  readonly [key: string]: ChatMessageDTO[];
}

export interface ChatMessageDTO {
  readonly authorId: string; 
  readonly isSent: boolean;
  readonly body: string;
  readonly media: any[];
  readonly lastUpdateTime: string;
}
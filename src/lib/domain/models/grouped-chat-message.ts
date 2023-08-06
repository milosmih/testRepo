export class GroupedChatMessage {
  [key: string]: ChatMessage[]
}

export class ChatMessage {
  constructor(
    public readonly authorId: string,
    public readonly isSent: boolean,
    public readonly body: string,
    public readonly media: any[],
    public readonly lastUpdateTime: string,
    public readonly index: number
  ) { }
}
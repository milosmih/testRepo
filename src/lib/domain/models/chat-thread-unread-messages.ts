
export class ChatThreadUnreadMessages {
  constructor(
    public readonly threadId: string,
    public readonly unreadMessagesCount: number
  ) { }
}
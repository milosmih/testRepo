export class ChatThread {
  constructor(
    public readonly threadId: string,
    public readonly lastMessage: any,
    public readonly metadata: any,
    public readonly title: string,
    public readonly photoUrl: string,
  ){ }
}
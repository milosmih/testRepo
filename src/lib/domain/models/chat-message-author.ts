export class ChatMessageAuthor {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly photoURL: string
  ) {}
}
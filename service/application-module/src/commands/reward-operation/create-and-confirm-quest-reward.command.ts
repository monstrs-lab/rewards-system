export class CreateAndConfirmQuestRewardCommand {
  constructor(
    public readonly questRewardId: string,
    public readonly recipientId: string,
    public readonly sourceId: string,
    public readonly sourceType: string,
    public readonly amount: number
  ) {}
}

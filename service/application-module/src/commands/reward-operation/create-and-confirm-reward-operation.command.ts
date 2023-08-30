export class CreateAndConfirmRewardOperationCommand {
  constructor(
    public readonly rewardOperationId: string,
    public readonly rewardProgram: string,
    public readonly referrerId: string,
    public readonly sourceId: string,
    public readonly sourceType: string,
    public readonly amount: number
  ) {}
}

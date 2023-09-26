export class CreateRewardProgramCommand {
  constructor(
    public readonly rewardProgramId: string,
    public readonly name: string,
    public readonly code: string,
    public readonly percentage: number
  ) {}
}

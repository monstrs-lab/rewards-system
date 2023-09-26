export class DeleteRewardProgramRuleCommand {
  constructor(
    public readonly rewardProgramRuleId: string,
    public readonly rewardProgramId: string
  ) {}
}

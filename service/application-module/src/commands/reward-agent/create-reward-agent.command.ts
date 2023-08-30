export class CreateRewardAgentCommand {
  constructor(
    public readonly id: string,
    public readonly rewardCode?: string
  ) {}
}

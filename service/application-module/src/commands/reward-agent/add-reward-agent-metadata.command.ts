export class AddRewardAgentMetadataCommand {
  constructor(
    public readonly rewardAgentId: string,
    public readonly metadata: Record<string, any>
  ) {}
}

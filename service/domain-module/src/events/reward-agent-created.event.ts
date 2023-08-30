export class RewardAgentCreatedEvent {
  constructor(
    public readonly rewardAgentId: string,
    public readonly code: string,
    public readonly parentId?: string
  ) {}
}

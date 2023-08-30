export class RewardProgramUpdatedEvent {
  constructor(
    public readonly rewardProgramId: string,
    public readonly name: string,
    public readonly percentage: number
  ) {}
}

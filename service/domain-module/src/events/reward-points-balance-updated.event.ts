export class RewardPointsBalanceUpdatedEvent {
  constructor(
    public readonly rewardPointsBalanceId: string,
    public readonly amount: number
  ) {}
}

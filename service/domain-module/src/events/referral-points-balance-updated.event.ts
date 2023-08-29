export class ReferralPointsBalanceUpdatedEvent {
  constructor(
    public readonly referralPointsBalanceId: string,
    public readonly amount: number
  ) {}
}

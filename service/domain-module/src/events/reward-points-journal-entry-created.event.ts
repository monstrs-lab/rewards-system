export class RewardPointsJournalEntryCreatedEvent {
  constructor(
    public readonly rewardPointsJournalEntryId: string,
    public readonly bookId: string,
    public readonly rewardId: string,
    public readonly number: string
  ) {}
}

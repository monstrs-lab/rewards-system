export class RewardPointsJournalEntryTransactionCommitedEvent {
  constructor(
    public readonly transactionId: string,
    public readonly bookId: string
  ) {}
}

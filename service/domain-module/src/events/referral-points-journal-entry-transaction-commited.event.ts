export class ReferralPointsJournalEntryTransactionCommitedEvent {
  constructor(
    public readonly transactionId: string,
    public readonly bookId: string
  ) {}
}

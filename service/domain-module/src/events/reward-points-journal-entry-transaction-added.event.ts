export class RewardPointsJournalEntryTransactionAddedEvent {
  constructor(
    public readonly transactionId: string,
    public readonly bookId: string,
    public readonly account: string,
    public readonly credit: number,
    public readonly debit: number
  ) {}
}

export class ReferralPointsJournalEntryCreatedEvent {
  constructor(
    public readonly referralPointsJournalEntryId: string,
    public readonly bookId: string,
    public readonly profitId: string,
    public readonly number: string
  ) {}
}

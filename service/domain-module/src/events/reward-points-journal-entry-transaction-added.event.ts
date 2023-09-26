import type { BigNumber } from 'bignumber.js'

export class RewardPointsJournalEntryTransactionAddedEvent {
  constructor(
    public readonly transactionId: string,
    public readonly bookId: string,
    public readonly account: string,
    public readonly credit: BigNumber,
    public readonly debit: BigNumber
  ) {}
}

import { AggregateRoot }                                      from '@nestjs/cqrs'
import { Guard }                                              from '@monstrs/guard-clause'
import { Against }                                            from '@monstrs/guard-clause'
import { customAlphabet }                                     from 'nanoid'
import { v4 as uuid }                                         from 'uuid'

import { ReferralPointsJournalEntryTransactionCommitedEvent } from '../events/index.js'
import { ReferralPointsJournalEntryTransactionAddedEvent }    from '../events/index.js'
import { ReferralPointsJournalEntryCreatedEvent }             from '../events/index.js'
import { ReferralPointsTransaction }                          from '../entities/index.js'
import { TransactionsNotZeroAmountError }                     from '../errors/index.js'

export class ReferralPointsJournalEntry extends AggregateRoot {
  #id!: string

  #bookId!: string

  #profitId!: string

  #number!: string

  #pendingTransactions: Array<ReferralPointsTransaction> = []

  #transactions: Array<ReferralPointsTransaction> = []

  get id(): string {
    return this.#id
  }

  private set id(id: string) {
    this.#id = id
  }

  get bookId(): string {
    return this.#bookId
  }

  private set bookId(bookId: string) {
    this.#bookId = bookId
  }

  get profitId(): string {
    return this.#profitId
  }

  private set profitId(profitId: string) {
    this.#profitId = profitId
  }

  get number(): string {
    return this.#number
  }

  private set number(number: string) {
    this.#number = number
  }

  get pendingTransactions(): Array<ReferralPointsTransaction> {
    return this.#pendingTransactions
  }

  private set pendingTransactions(transactions: Array<ReferralPointsTransaction>) {
    this.#pendingTransactions = transactions
  }

  get transactions(): Array<ReferralPointsTransaction> {
    return this.#transactions
  }

  private set transactions(transactions: Array<ReferralPointsTransaction>) {
    this.#transactions = transactions
  }

  @Guard()
  create(
    @Against('id').NotUUID(4) id: string,
    @Against('bookId').NotUUID(4) bookId: string,
    @Against('profitId').NotUUID(4) profitId: string
  ): ReferralPointsJournalEntry {
    this.apply(
      new ReferralPointsJournalEntryCreatedEvent(
        id,
        bookId,
        profitId,
        customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 24)()
      )
    )

    return this
  }

  @Guard()
  credit(
    @Against('account').Empty() account: string,
    @Against('amount').NotNumberBetween(0, Infinity) amount: number
  ): ReferralPointsJournalEntry {
    this.apply(
      new ReferralPointsJournalEntryTransactionAddedEvent(uuid(), this.bookId, account, amount, 0)
    )

    return this
  }

  @Guard()
  debit(
    @Against('account').Empty() account: string,
    @Against('amount').NotNumberBetween(0, Infinity) amount: number
  ): ReferralPointsJournalEntry {
    this.apply(
      new ReferralPointsJournalEntryTransactionAddedEvent(uuid(), this.bookId, account, 0, amount)
    )

    return this
  }

  commitTransactions(): ReferralPointsJournalEntry {
    const total = this.pendingTransactions.reduce((result, tx) => result + tx.credit - tx.debit, 0)

    if (total !== 0) {
      throw new TransactionsNotZeroAmountError()
    }

    this.apply(new ReferralPointsJournalEntryTransactionCommitedEvent(this.id, this.bookId))

    return this
  }

  protected onReferralPointsJournalEntryCreatedEvent(
    event: ReferralPointsJournalEntryCreatedEvent
  ): void {
    this.id = event.referralPointsJournalEntryId
    this.bookId = event.bookId
    this.profitId = event.profitId
    this.number = event.number
  }

  protected onReferralPointsJournalEntryTransactionAddedEvent(
    event: ReferralPointsJournalEntryTransactionAddedEvent
  ): void {
    this.#pendingTransactions.push(
      ReferralPointsTransaction.create(
        event.transactionId,
        event.bookId,
        event.account,
        event.credit,
        event.debit
      )
    )
  }

  protected onReferralPointsJournalEntryTransactionCommitedEvent(): void {
    this.transactions = this.pendingTransactions
    this.pendingTransactions = []
  }
}

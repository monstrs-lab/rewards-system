import { AggregateRoot }                                    from '@nestjs/cqrs'
import { Guard }                                            from '@monstrs/guard-clause'
import { Against }                                          from '@monstrs/guard-clause'
import { customAlphabet }                                   from 'nanoid'
import { v4 as uuid }                                       from 'uuid'

import { RewardPointsJournalEntryTransactionCommitedEvent } from '../events/index.js'
import { RewardPointsJournalEntryTransactionAddedEvent }    from '../events/index.js'
import { RewardPointsJournalEntryCreatedEvent }             from '../events/index.js'
import { RewardPointsTransaction }                          from '../entities/index.js'
import { TransactionsNotZeroAmountError }                   from '../errors/index.js'

export class RewardPointsJournalEntry extends AggregateRoot {
  #id!: string

  #bookId!: string

  #rewardId!: string

  #number!: string

  #pendingTransactions: Array<RewardPointsTransaction> = []

  #transactions: Array<RewardPointsTransaction> = []

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

  get rewardId(): string {
    return this.#rewardId
  }

  private set rewardId(rewardId: string) {
    this.#rewardId = rewardId
  }

  get number(): string {
    return this.#number
  }

  private set number(number: string) {
    this.#number = number
  }

  get pendingTransactions(): Array<RewardPointsTransaction> {
    return this.#pendingTransactions
  }

  private set pendingTransactions(transactions: Array<RewardPointsTransaction>) {
    this.#pendingTransactions = transactions
  }

  get transactions(): Array<RewardPointsTransaction> {
    return this.#transactions
  }

  private set transactions(transactions: Array<RewardPointsTransaction>) {
    this.#transactions = transactions
  }

  @Guard()
  create(
    @Against('id').NotUUID(4) id: string,
    @Against('bookId').NotUUID(4) bookId: string,
    @Against('rewardId').NotUUID(4) rewardId: string
  ): RewardPointsJournalEntry {
    this.apply(
      new RewardPointsJournalEntryCreatedEvent(
        id,
        bookId,
        rewardId,
        customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 24)()
      )
    )

    return this
  }

  @Guard()
  credit(
    @Against('account').Empty() account: string,
    @Against('amount').NotNumberBetween(0, Infinity) amount: number
  ): RewardPointsJournalEntry {
    this.apply(
      new RewardPointsJournalEntryTransactionAddedEvent(uuid(), this.bookId, account, amount, 0)
    )

    return this
  }

  @Guard()
  debit(
    @Against('account').Empty() account: string,
    @Against('amount').NotNumberBetween(0, Infinity) amount: number
  ): RewardPointsJournalEntry {
    this.apply(
      new RewardPointsJournalEntryTransactionAddedEvent(uuid(), this.bookId, account, 0, amount)
    )

    return this
  }

  commitTransactions(): RewardPointsJournalEntry {
    const total = this.pendingTransactions.reduce((result, tx) => result + tx.credit - tx.debit, 0)

    if (total !== 0) {
      throw new TransactionsNotZeroAmountError()
    }

    this.apply(new RewardPointsJournalEntryTransactionCommitedEvent(this.id, this.bookId))

    return this
  }

  protected onRewardPointsJournalEntryCreatedEvent(
    event: RewardPointsJournalEntryCreatedEvent
  ): void {
    this.id = event.rewardPointsJournalEntryId
    this.bookId = event.bookId
    this.rewardId = event.rewardId
    this.number = event.number
  }

  protected onRewardPointsJournalEntryTransactionAddedEvent(
    event: RewardPointsJournalEntryTransactionAddedEvent
  ): void {
    this.#pendingTransactions.push(
      RewardPointsTransaction.create(
        event.transactionId,
        event.bookId,
        event.account,
        event.credit,
        event.debit
      )
    )
  }

  protected onRewardPointsJournalEntryTransactionCommitedEvent(): void {
    this.transactions = this.pendingTransactions
    this.pendingTransactions = []
  }
}

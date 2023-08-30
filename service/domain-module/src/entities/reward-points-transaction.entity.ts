import { Guard }   from '@monstrs/guard-clause'
import { Against } from '@monstrs/guard-clause'

export class RewardPointsTransaction {
  #id!: string

  #bookId!: string

  #account!: string

  #credit!: number

  #debit!: number

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

  get account(): string {
    return this.#account
  }

  private set account(account: string) {
    this.#account = account
  }

  get credit(): number {
    return this.#credit
  }

  private set credit(credit: number) {
    this.#credit = credit
  }

  get debit(): number {
    return this.#debit
  }

  private set debit(debit: number) {
    this.#debit = debit
  }

  @Guard()
  static create(
    @Against('id').NotUUID(4) id: string,
    @Against('bookId').NotUUID(4) bookId: string,
    @Against('account').Empty() account: string,
    @Against('credit').NotNumberBetween(0, Infinity) credit: number,
    @Against('debit').NotNumberBetween(0, Infinity) debit: number
  ): RewardPointsTransaction {
    const rewardPointsTransaction = new RewardPointsTransaction()

    rewardPointsTransaction.id = id
    rewardPointsTransaction.bookId = bookId
    rewardPointsTransaction.account = account
    rewardPointsTransaction.credit = credit
    rewardPointsTransaction.debit = debit

    return rewardPointsTransaction
  }
}

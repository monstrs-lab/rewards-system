import { DomainError } from '@monstrs/core-errors'

export class TransactionsNotZeroAmountError extends DomainError {
  constructor() {
    super()
    this.message = 'Invalid Journal Entry. Total not zero.'
  }
}

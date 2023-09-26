import { DomainError } from '@monstrs/core-errors'

export class NotAllowedForConfirmationError extends DomainError {
  constructor() {
    super()
    this.message = 'Action not allowed for confirmation'
  }
}

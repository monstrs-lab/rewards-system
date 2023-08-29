import { DomainError } from '@monstrs/core-errors'

export class ReferralOperationNotAllowedForConfirmationError extends DomainError {
  constructor() {
    super()
    this.message = 'Referral operation not allowed for confirmation'
  }
}

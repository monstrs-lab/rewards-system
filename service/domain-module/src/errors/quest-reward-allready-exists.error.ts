import { DomainError } from '@monstrs/core-errors'

export class QuestRewardAllreadyExistsError extends DomainError {
  constructor() {
    super()
    this.message = 'Quest reward allready exists'
  }
}

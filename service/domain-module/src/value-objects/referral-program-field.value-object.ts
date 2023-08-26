import { Guard }                     from '@monstrs/guard-clause'
import { Against }                   from '@monstrs/guard-clause'

import { ReferralProgramConditions } from './referral-program-conditions.value-object.js'

export class ReferralProgramField {
  #percentage!: number

  #conditions!: ReferralProgramConditions

  get percentage(): number {
    return this.#percentage
  }

  private set percentage(percentage: number) {
    this.#percentage = percentage
  }

  get conditions(): ReferralProgramConditions {
    return this.#conditions
  }

  private set conditions(conditions: ReferralProgramConditions) {
    this.#conditions = conditions
  }

  @Guard()
  static create(
    @Against('percentage').NotNumberBetween(0, 100) percentage: number,
    @Against('conditions').NotInstance(ReferralProgramConditions)
    conditions: ReferralProgramConditions
  ): ReferralProgramField {
    const referralProgramField = new ReferralProgramField()

    referralProgramField.percentage = percentage
    referralProgramField.conditions = conditions

    return referralProgramField
  }
}

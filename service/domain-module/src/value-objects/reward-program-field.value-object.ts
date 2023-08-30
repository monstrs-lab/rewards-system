import { Guard }                   from '@monstrs/guard-clause'
import { Against }                 from '@monstrs/guard-clause'

import { RewardProgramConditions } from './reward-program-conditions.value-object.js'

export class RewardProgramField {
  #percentage!: number

  #conditions!: RewardProgramConditions

  get percentage(): number {
    return this.#percentage
  }

  private set percentage(percentage: number) {
    this.#percentage = percentage
  }

  get conditions(): RewardProgramConditions {
    return this.#conditions
  }

  private set conditions(conditions: RewardProgramConditions) {
    this.#conditions = conditions
  }

  @Guard()
  static create(
    @Against('percentage').NotNumberBetween(0, 100) percentage: number,
    @Against('conditions').NotInstance(RewardProgramConditions)
    conditions: RewardProgramConditions
  ): RewardProgramField {
    const rewardProgramField = new RewardProgramField()

    rewardProgramField.percentage = percentage
    rewardProgramField.conditions = conditions

    return rewardProgramField
  }
}

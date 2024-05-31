import type { TopLevelCondition }  from '@rewards-system/domain-module'
import type { RewardProgramField } from '@rewards-system/rewards-rpc/interfaces'

import { Max }                     from 'class-validator'
import { Min }                     from 'class-validator'

import { IsConditionsValid }       from '../../validators/index.js'

export class RewardProgramFieldPayload {
  constructor(private readonly request: RewardProgramField) {}

  @Min(0)
  @Max(100)
  get percentage(): number {
    return this.request.percentage
  }

  @IsConditionsValid()
  get conditions(): TopLevelCondition {
    return this.request.conditions?.toJson() as TopLevelCondition
  }
}

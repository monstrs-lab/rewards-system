// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { TopLevelCondition }    from '@referral-programs/domain-module'
import type { ReferralProgramField } from '@referral-programs/referral-programs-rpc/interfaces'

import { Max }                       from 'class-validator'
import { Min }                       from 'class-validator'

import { IsConditionsValid }         from '../../validators/index.js'

export class ReferralProgramFieldPayload {
  constructor(private readonly request: ReferralProgramField) {}

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

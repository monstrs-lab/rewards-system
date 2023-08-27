// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { TopLevelCondition }             from '@referral-programs/domain-module'
import type { AddReferralProgramRuleRequest } from '@referral-programs/referral-programs-rpc/interfaces'

import { IsNotEmpty }                         from 'class-validator'
import { IsUUID }                             from 'class-validator'
import { Min }                                from 'class-validator'
import { ValidateNested }                     from 'class-validator'

import { IsConditionsValid }                  from '../../validators/index.js'
import { ReferralProgramFieldPayload }        from './referral-program-field.payload.js'

export class AddReferralProgramRulePayload {
  constructor(private readonly request: AddReferralProgramRuleRequest) {}

  @IsUUID(4)
  get referralProgramId(): string {
    return this.request.referralProgramId
  }

  @Min(0)
  get order(): number {
    return this.request.order
  }

  @IsNotEmpty()
  get name(): string {
    return this.request.name
  }

  @IsConditionsValid()
  get conditions(): TopLevelCondition {
    return this.request.conditions?.toJson() as TopLevelCondition
  }

  @ValidateNested()
  get fields(): Array<{ percentage: number; conditions: TopLevelCondition }> {
    return this.request.fields.map((field) => new ReferralProgramFieldPayload(field))
  }
}

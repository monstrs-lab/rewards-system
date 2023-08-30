// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { TopLevelCondition }           from '@rewards-system/domain-module'
import type { AddRewardProgramRuleRequest } from '@rewards-system/rewards-system-rpc/interfaces'

import { IsNotEmpty }                       from 'class-validator'
import { IsUUID }                           from 'class-validator'
import { Min }                              from 'class-validator'
import { ValidateNested }                   from 'class-validator'

import { IsConditionsValid }                from '../../validators/index.js'
import { RewardProgramFieldPayload }        from './reward-program-field.payload.js'

export class AddRewardProgramRulePayload {
  constructor(private readonly request: AddRewardProgramRuleRequest) {}

  @IsUUID(4)
  get rewardProgramId(): string {
    return this.request.rewardProgramId
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
    return this.request.fields.map((field) => new RewardProgramFieldPayload(field))
  }
}

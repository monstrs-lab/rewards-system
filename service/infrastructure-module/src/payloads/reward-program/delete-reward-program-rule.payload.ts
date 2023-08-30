import type { DeleteRewardProgramRuleRequest } from '@rewards-system/rewards-system-rpc/interfaces'

import { IsUUID }                              from 'class-validator'

export class DeleteRewardProgramRulePayload {
  constructor(private readonly request: DeleteRewardProgramRuleRequest) {}

  @IsUUID(4)
  get rewardProgramId(): string {
    return this.request.rewardProgramId
  }

  @IsUUID(4)
  get rewardProgramRuleId(): string {
    return this.request.rewardProgramRuleId
  }
}

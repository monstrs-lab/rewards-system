import type { UpdateRewardProgramRequest } from '@rewards-system/rewards-rpc/interfaces'

import { IsNotEmpty }                      from 'class-validator'
import { IsUUID }                          from 'class-validator'
import { Min }                             from 'class-validator'
import { Max }                             from 'class-validator'

export class UpdateRewardProgramPayload {
  constructor(private readonly request: UpdateRewardProgramRequest) {}

  @IsUUID(4)
  get rewardProgramId(): string {
    return this.request.rewardProgramId
  }

  @IsNotEmpty()
  get name(): string {
    return this.request.name
  }

  @Min(1)
  @Max(100)
  get percentage(): number {
    return this.request.percentage
  }
}

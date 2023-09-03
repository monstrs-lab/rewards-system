import type { CreateRewardOperationRequest } from '@rewards-system/rewards-rpc/interfaces'

import { IsNotEmpty }                        from 'class-validator'
import { IsUUID }                            from 'class-validator'
import { Min }                               from 'class-validator'

export class CreateRewardOperationPayload {
  constructor(private readonly request: CreateRewardOperationRequest) {}

  @IsNotEmpty()
  get rewardProgram(): string {
    return this.request.rewardProgram
  }

  @IsUUID(4)
  get sourceId(): string {
    return this.request.sourceId
  }

  @IsNotEmpty()
  get sourceType(): string {
    return this.request.sourceType
  }

  @IsUUID(4)
  get referrerId(): string {
    return this.request.referrerId
  }

  @Min(1)
  get amount(): number {
    return this.request.amount
  }
}

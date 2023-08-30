import type { CreateAndConfirmRewardOperationRequest } from '@rewards-system/rewards-system-rpc/interfaces'

import { IsNotEmpty }                                  from 'class-validator'
import { IsUUID }                                      from 'class-validator'
import { Min }                                         from 'class-validator'

export class CreateAndConfirmRewardOperationPayload {
  constructor(private readonly request: CreateAndConfirmRewardOperationRequest) {}

  @IsNotEmpty()
  get rewardProgram(): string {
    return this.request.rewardProgram
  }

  @IsUUID(4)
  get referrerId(): string {
    return this.request.referrerId
  }

  @IsUUID(4)
  get sourceId(): string {
    return this.request.sourceId
  }

  @IsNotEmpty()
  get sourceType(): string {
    return this.request.sourceType
  }

  @Min(1)
  get amount(): number {
    return this.request.amount
  }
}

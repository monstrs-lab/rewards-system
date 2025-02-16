import type { CreateAndConfirmQuestRewardRequest } from '@rewards-system/rewards-rpc/interfaces'

import { IsNotEmpty }                              from 'class-validator'
import { IsUUID }                                  from 'class-validator'
import { Min }                                     from 'class-validator'

export class CreateAndConfirmQuestRewardPayload {
  constructor(private readonly request: CreateAndConfirmQuestRewardRequest) {}

  @IsUUID(4)
  get recipientId(): string {
    return this.request.recipientId
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

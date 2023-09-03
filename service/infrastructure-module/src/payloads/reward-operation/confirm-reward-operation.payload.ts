import type { ConfirmRewardOperationRequest } from '@rewards-system/rewards-rpc/interfaces'

import { IsUUID }                             from 'class-validator'

export class ConfirmRewardOperationPayload {
  constructor(private readonly request: ConfirmRewardOperationRequest) {}

  @IsUUID(4)
  get rewardOperationId(): string {
    return this.request.rewardOperationId
  }
}

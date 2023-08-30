import type { AddRewardAgentMetadataRequest } from '@rewards-system/rewards-system-rpc/interfaces'

import { IsNotEmptyObject }                   from 'class-validator'
import { IsUUID }                             from 'class-validator'

export class AddRewardAgentMetadataPayload {
  constructor(private readonly request: AddRewardAgentMetadataRequest) {}

  @IsUUID(4)
  get rewardAgentId(): string {
    return this.request.rewardAgentId
  }

  @IsNotEmptyObject()
  get metadata(): Record<string, any> {
    return this.request.metadata?.toJson() as Record<string, any>
  }
}

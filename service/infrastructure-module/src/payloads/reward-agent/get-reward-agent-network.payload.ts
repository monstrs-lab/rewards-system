import type { GetRewardAgentNetworkRequest } from '@rewards-system/rewards-system-rpc/interfaces'

import { IsUUID }                            from 'class-validator'

export class GetRewardAgentNetworkPayload {
  constructor(private readonly request: GetRewardAgentNetworkRequest) {}

  @IsUUID(4)
  get rewardAgentId(): string {
    return this.request.rewardAgentId
  }
}

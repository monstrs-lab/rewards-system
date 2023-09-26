import type { RewardOperation }          from '@rewards-system/domain-module'

import { CreateRewardOperationResponse } from '@rewards-system/rewards-rpc/abstractions'

import { RewardOperationSerializer }     from './reward-operation.serializer.js'

export class CreateRewardOperationSerializer extends CreateRewardOperationResponse {
  constructor(private readonly rewardOperation: RewardOperation) {
    super()
  }

  get result(): RewardOperationSerializer {
    return new RewardOperationSerializer(this.rewardOperation)
  }
}

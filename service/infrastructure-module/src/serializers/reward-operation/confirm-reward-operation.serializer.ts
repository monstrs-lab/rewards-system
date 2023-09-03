import type { RewardOperation }           from '@rewards-system/domain-module'

import { ConfirmRewardOperationResponse } from '@rewards-system/rewards-rpc/abstractions'

import { RewardOperationSerializer }      from './reward-operation.serializer.js'

export class ConfirmRewardOperationSerializer extends ConfirmRewardOperationResponse {
  constructor(private readonly rewardOperation: RewardOperation) {
    super()
  }

  get result(): RewardOperationSerializer {
    return new RewardOperationSerializer(this.rewardOperation)
  }
}

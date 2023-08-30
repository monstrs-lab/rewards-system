import type { RewardOperation }                    from '@rewards-system/domain-module'

import { CreateAndConfirmRewardOperationResponse } from '@rewards-system/rewards-system-rpc/abstractions'

import { RewardOperationSerializer }               from './reward-operation.serializer.js'

export class CreateAndConfirmRewardOperationSerializer extends CreateAndConfirmRewardOperationResponse {
  constructor(private readonly rewardOperation: RewardOperation) {
    super()
  }

  get result(): RewardOperationSerializer {
    return new RewardOperationSerializer(this.rewardOperation)
  }
}

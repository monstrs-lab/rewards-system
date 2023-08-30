import type { RewardOperation }         from '@rewards-system/domain-module'

import { ListRewardOperationsResponse } from '@rewards-system/rewards-system-rpc/abstractions'

import { RewardOperationSerializer }    from './reward-operation.serializer.js'

export class ListRewardOperationsSerializer extends ListRewardOperationsResponse {
  constructor(
    private readonly query: { rewardOperations: Array<RewardOperation>; hasNextPage: boolean }
  ) {
    super()
  }

  get rewardOperations(): Array<RewardOperationSerializer> {
    return this.query.rewardOperations.map(
      (rewardOperation) => new RewardOperationSerializer(rewardOperation)
    )
  }

  get hasNextPage(): boolean {
    return this.query.hasNextPage
  }
}

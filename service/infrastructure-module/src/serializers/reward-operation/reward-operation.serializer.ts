import type { RewardOperation } from '@rewards-system/domain-module'

import { Timestamp }            from '@bufbuild/protobuf'

import * as rpc                 from '@rewards-system/rewards-system-rpc/abstractions'

export class RewardOperationSerializer extends rpc.RewardOperation {
  constructor(private readonly rewardOperation: RewardOperation) {
    super()
  }

  get id(): string {
    return this.rewardOperation.id
  }

  get rewardProgramId(): string {
    return this.rewardOperation.rewardProgramId
  }

  get status(): rpc.RewardOperationStatus {
    return this.rewardOperation.status
  }

  get source(): rpc.RewardOperation_Source {
    return this.rewardOperation.source
  }

  get referrerId(): string {
    return this.rewardOperation.referrerId
  }

  get amount(): number {
    return this.rewardOperation.amount
  }

  get createdAt(): Timestamp {
    return Timestamp.fromDate(this.rewardOperation.createdAt)
  }
}

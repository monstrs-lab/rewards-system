import type { Reward } from '@rewards-system/domain-module'

import { Timestamp }   from '@bufbuild/protobuf'

import * as rpc        from '@rewards-system/rewards-system-rpc/abstractions'

export class RewardSerializer extends rpc.Reward {
  constructor(private readonly reward: Reward) {
    super()
  }

  get id(): string {
    return this.reward.id
  }

  get status(): rpc.RewardOperationStatus {
    return this.reward.status
  }

  get operationId(): string {
    return this.reward.operationId
  }

  get agentId(): string {
    return this.reward.agentId
  }

  get referrerId(): string {
    return this.reward.referrerId
  }

  get amount(): number {
    return this.reward.amount
  }

  get profit(): number {
    return this.reward.profit
  }

  get percentage(): number {
    return this.reward.percentage
  }

  get level(): number {
    return this.reward.level
  }

  get createdAt(): Timestamp {
    return Timestamp.fromDate(this.reward.createdAt)
  }
}

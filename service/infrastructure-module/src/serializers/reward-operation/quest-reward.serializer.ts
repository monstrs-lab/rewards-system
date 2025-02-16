import type { QuestReward } from '@rewards-system/domain-module'

import { Timestamp }        from '@bufbuild/protobuf'

import * as rpc             from '@rewards-system/rewards-rpc/abstractions'

export class QuestRewardSerializer extends rpc.QuestReward {
  constructor(private readonly reward: QuestReward) {
    super()
  }

  get id(): string {
    return this.reward.id
  }

  get status(): rpc.RewardOperationStatus {
    return this.reward.status
  }

  get recipientId(): string {
    return this.reward.recipientId
  }

  get source(): rpc.QuestReward_Source {
    return this.reward.source
  }

  get amount(): number {
    return this.reward.amount?.toNumber()
  }

  get createdAt(): Timestamp {
    return Timestamp.fromDate(this.reward.createdAt)
  }
}

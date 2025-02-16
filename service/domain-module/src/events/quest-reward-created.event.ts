import type { BigNumber }             from 'bignumber.js'

import type { QuestRewardSource }     from '../entities/index.js'
import type { RewardOperationStatus } from '../enums/index.js'

export class QuestRewardCreatedEvent {
  constructor(
    public readonly questRewardId: string,
    public readonly recipientId: string,
    public readonly status: RewardOperationStatus,
    public readonly source: QuestRewardSource,
    public readonly amount: BigNumber,
    public readonly createdAt: Date
  ) {}
}

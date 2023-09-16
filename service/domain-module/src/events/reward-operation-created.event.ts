import type { BigNumber }             from 'bignumber.js'

import type { RewardOperationSource } from '../entities/index.js'
import type { RewardOperationStatus } from '../enums/index.js'

export class RewardOperationCreatedEvent {
  constructor(
    public readonly rewardOperationId: string,
    public readonly rewardProgramId: string,
    public readonly referrerId: string,
    public readonly status: RewardOperationStatus,
    public readonly source: RewardOperationSource,
    public readonly amount: BigNumber,
    public readonly createdAt: Date
  ) {}
}

import type { BigNumber }             from 'bignumber.js'

import type { RewardOperationStatus } from '../enums/index.js'

export class RewardCreatedEvent {
  constructor(
    public readonly rewardId: string,
    public readonly operationId: string,
    public readonly agentId: string,
    public readonly referrerId: string,
    public readonly status: RewardOperationStatus,
    public readonly amount: BigNumber,
    public readonly profit: BigNumber,
    public readonly percentage: number,
    public readonly level: number,
    public readonly createdAt: Date
  ) {}
}

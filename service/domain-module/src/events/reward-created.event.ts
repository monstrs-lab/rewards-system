import type { RewardOperationStatus } from '../enums/index.js'

export class RewardCreatedEvent {
  constructor(
    public readonly rewardId: string,
    public readonly operationId: string,
    public readonly agentId: string,
    public readonly referrerId: string,
    public readonly status: RewardOperationStatus,
    public readonly amount: number,
    public readonly profit: number,
    public readonly percentage: number,
    public readonly level: number,
    public readonly createdAt: Date
  ) {}
}

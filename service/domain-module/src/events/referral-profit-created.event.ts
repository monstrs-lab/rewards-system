import type { ReferralOperationStatus } from '../enums/index.js'

export class ReferralProfitCreatedEvent {
  constructor(
    public readonly referralProfitId: string,
    public readonly operationId: string,
    public readonly agentId: string,
    public readonly referrerId: string,
    public readonly status: ReferralOperationStatus,
    public readonly amount: number,
    public readonly profit: number,
    public readonly percentage: number,
    public readonly level: number,
    public readonly createdAt: Date
  ) {}
}

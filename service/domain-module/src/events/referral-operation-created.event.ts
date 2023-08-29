import type { ReferralOperationStatus } from '../enums/index.js'
import type { ReferralOperationSource } from '../entities/index.js'

export class ReferralOperationCreatedEvent {
  constructor(
    public readonly referralOperationId: string,
    public readonly referralProgramId: string,
    public readonly referrerId: string,
    public readonly status: ReferralOperationStatus,
    public readonly source: ReferralOperationSource,
    public readonly amount: number,
    public readonly createdAt: Date
  ) {}
}

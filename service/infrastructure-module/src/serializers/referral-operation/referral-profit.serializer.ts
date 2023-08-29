import type { ReferralProfit } from '@referral-programs/domain-module'

import { Timestamp }           from '@bufbuild/protobuf'

import * as rpc                from '@referral-programs/referral-programs-rpc/abstractions'

export class ReferralProfitSerializer extends rpc.ReferralProfit {
  constructor(private readonly referralProfit: ReferralProfit) {
    super()
  }

  get id(): string {
    return this.referralProfit.id
  }

  get status(): rpc.ReferralOperationStatus {
    return this.referralProfit.status
  }

  get operationId(): string {
    return this.referralProfit.operationId
  }

  get agentId(): string {
    return this.referralProfit.agentId
  }

  get referrerId(): string {
    return this.referralProfit.referrerId
  }

  get amount(): number {
    return this.referralProfit.amount
  }

  get profit(): number {
    return this.referralProfit.profit
  }

  get percentage(): number {
    return this.referralProfit.percentage
  }

  get level(): number {
    return this.referralProfit.level
  }

  get createdAt(): Timestamp {
    return Timestamp.fromDate(this.referralProfit.createdAt)
  }
}

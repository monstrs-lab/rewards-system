import type { ReferralPointsBalance } from '@referral-programs/domain-module'

import * as rpc                       from '@referral-programs/referral-programs-rpc/abstractions'

export class ReferralPointsBalanceSerializer extends rpc.ReferralPointsBalance {
  constructor(private readonly referralPointsBalance: ReferralPointsBalance) {
    super()
  }

  get id(): string {
    return this.referralPointsBalance.id
  }

  get amount(): number {
    return this.referralPointsBalance.amount
  }
}

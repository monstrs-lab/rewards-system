import type { RewardPointsBalance } from '@rewards-system/domain-module'

import * as rpc                     from '@rewards-system/rewards-rpc/abstractions'

export class RewardPointsBalanceSerializer extends rpc.RewardPointsBalance {
  constructor(private readonly rewardPointsBalance: RewardPointsBalance) {
    super()
  }

  get id(): string {
    return this.rewardPointsBalance.id
  }

  get amount(): number {
    return this.rewardPointsBalance.amount
  }
}

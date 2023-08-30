import type { RewardPointsBalance }         from '@rewards-system/domain-module'

import { ListRewardPointsBalancesResponse } from '@rewards-system/rewards-system-rpc/abstractions'

import { RewardPointsBalanceSerializer }    from './reward-points-balance.serializer.js'

export class ListRewardPointsBalancesSerializer extends ListRewardPointsBalancesResponse {
  constructor(
    private readonly query: {
      rewardPointsBalances: Array<RewardPointsBalance>
      hasNextPage: boolean
    }
  ) {
    super()
  }

  get rewardPointsBalances(): Array<RewardPointsBalanceSerializer> {
    return this.query.rewardPointsBalances.map(
      (rewardPointsBalance) => new RewardPointsBalanceSerializer(rewardPointsBalance)
    )
  }

  get hasNextPage(): boolean {
    return this.query.hasNextPage
  }
}

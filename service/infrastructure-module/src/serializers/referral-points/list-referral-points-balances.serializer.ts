import type { ReferralPointsBalance }         from '@referral-programs/domain-module'

import { ListReferralPointsBalancesResponse } from '@referral-programs/referral-programs-rpc/abstractions'

import { ReferralPointsBalanceSerializer }    from './referral-points-balance.serializer.js'

export class ListReferralPointsBalancesSerializer extends ListReferralPointsBalancesResponse {
  constructor(
    private readonly query: {
      referralPointsBalances: Array<ReferralPointsBalance>
      hasNextPage: boolean
    }
  ) {
    super()
  }

  get referralPointsBalances(): Array<ReferralPointsBalanceSerializer> {
    return this.query.referralPointsBalances.map(
      (referralPointsBalance) => new ReferralPointsBalanceSerializer(referralPointsBalance)
    )
  }

  get hasNextPage(): boolean {
    return this.query.hasNextPage
  }
}

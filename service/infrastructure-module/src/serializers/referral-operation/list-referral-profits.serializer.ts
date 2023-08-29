import type { ReferralProfit }         from '@referral-programs/domain-module'

import { ListReferralProfitsResponse } from '@referral-programs/referral-programs-rpc/abstractions'

import { ReferralProfitSerializer }    from './referral-profit.serializer.js'

export class ListReferralProfitsSerializer extends ListReferralProfitsResponse {
  constructor(
    private readonly query: { referralProfits: Array<ReferralProfit>; hasNextPage: boolean }
  ) {
    super()
  }

  get referralProfits(): Array<ReferralProfitSerializer> {
    return this.query.referralProfits.map(
      (referralProfit) => new ReferralProfitSerializer(referralProfit)
    )
  }

  get hasNextPage(): boolean {
    return this.query.hasNextPage
  }
}

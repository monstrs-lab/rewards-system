import type { FindReferralProfitsByQuery } from '@referral-programs/domain-module'

export class GetReferralProfitsQuery {
  constructor(
    public readonly pager?: FindReferralProfitsByQuery['pager'],
    public readonly order?: FindReferralProfitsByQuery['order'],
    public readonly query?: FindReferralProfitsByQuery['query']
  ) {}
}

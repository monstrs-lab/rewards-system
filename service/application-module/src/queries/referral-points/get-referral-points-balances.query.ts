import type { FindReferralPointsBalancesByQuery } from '@referral-programs/domain-module'

export class GetReferralPointsBalancesQuery {
  constructor(
    public readonly pager?: FindReferralPointsBalancesByQuery['pager'],
    public readonly order?: FindReferralPointsBalancesByQuery['order'],
    public readonly query?: FindReferralPointsBalancesByQuery['query']
  ) {}
}

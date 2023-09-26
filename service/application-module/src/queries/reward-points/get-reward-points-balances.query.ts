import type { FindRewardPointsBalancesByQuery } from '@rewards-system/domain-module'

export class GetRewardPointsBalancesQuery {
  constructor(
    public readonly pager?: FindRewardPointsBalancesByQuery['pager'],
    public readonly order?: FindRewardPointsBalancesByQuery['order'],
    public readonly query?: FindRewardPointsBalancesByQuery['query']
  ) {}
}

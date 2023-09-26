import type { FindRewardsByQuery } from '@rewards-system/domain-module'

export class GetRewardsQuery {
  constructor(
    public readonly pager?: FindRewardsByQuery['pager'],
    public readonly order?: FindRewardsByQuery['order'],
    public readonly query?: FindRewardsByQuery['query']
  ) {}
}

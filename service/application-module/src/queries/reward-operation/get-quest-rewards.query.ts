import type { FindQuestRewardsByQuery } from '@rewards-system/domain-module'

export class GetQuestRewardsQuery {
  constructor(
    public readonly pager?: FindQuestRewardsByQuery['pager'],
    public readonly order?: FindQuestRewardsByQuery['order'],
    public readonly query?: FindQuestRewardsByQuery['query']
  ) {}
}

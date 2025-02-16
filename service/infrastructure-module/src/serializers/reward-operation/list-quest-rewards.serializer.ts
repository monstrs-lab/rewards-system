import type { QuestReward }         from '@rewards-system/domain-module'

import { ListQuestRewardsResponse } from '@rewards-system/rewards-rpc/abstractions'

import { QuestRewardSerializer }    from './quest-reward.serializer.js'

export class ListQuestRewardsSerializer extends ListQuestRewardsResponse {
  constructor(private readonly query: { rewards: Array<QuestReward>; hasNextPage: boolean }) {
    super()
  }

  get rewards(): Array<QuestRewardSerializer> {
    return this.query.rewards.map((reward) => new QuestRewardSerializer(reward))
  }

  get hasNextPage(): boolean {
    return this.query.hasNextPage
  }
}

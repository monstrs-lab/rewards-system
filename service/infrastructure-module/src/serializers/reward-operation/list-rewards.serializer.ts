import type { Reward }         from '@rewards-system/domain-module'

import { ListRewardsResponse } from '@rewards-system/rewards-system-rpc/abstractions'

import { RewardSerializer }    from './reward.serializer.js'

export class ListRewardsSerializer extends ListRewardsResponse {
  constructor(private readonly query: { rewards: Array<Reward>; hasNextPage: boolean }) {
    super()
  }

  get rewards(): Array<RewardSerializer> {
    return this.query.rewards.map((reward) => new RewardSerializer(reward))
  }

  get hasNextPage(): boolean {
    return this.query.hasNextPage
  }
}

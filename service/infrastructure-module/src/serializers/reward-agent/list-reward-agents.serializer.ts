import type { RewardAgent }         from '@rewards-system/domain-module'

import { ListRewardAgentsResponse } from '@rewards-system/rewards-rpc/abstractions'

import { RewardAgentSerializer }    from './reward-agent.serializer.js'

export class ListRewardAgentsSerializer extends ListRewardAgentsResponse {
  constructor(private readonly query: { rewardAgents: Array<RewardAgent>; hasNextPage: boolean }) {
    super()
  }

  get rewardAgents(): Array<RewardAgentSerializer> {
    return this.query.rewardAgents.map((rewardAgent) => new RewardAgentSerializer(rewardAgent))
  }

  get hasNextPage(): boolean {
    return this.query.hasNextPage
  }
}

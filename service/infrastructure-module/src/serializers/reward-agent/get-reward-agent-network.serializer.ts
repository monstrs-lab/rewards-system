import type { RewardAgent }              from '@rewards-system/domain-module'

import { GetRewardAgentNetworkResponse } from '@rewards-system/rewards-system-rpc/abstractions'

import { RewardAgentSerializer }         from './reward-agent.serializer.js'

export class GetRewardAgentNetworkSerializer extends GetRewardAgentNetworkResponse {
  constructor(private readonly query: Array<RewardAgent>) {
    super()
  }

  get rewardAgents(): Array<RewardAgentSerializer> {
    return this.query.map((rewardAgent) => new RewardAgentSerializer(rewardAgent))
  }
}

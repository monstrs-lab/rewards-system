import type { RewardAgent }               from '@rewards-system/domain-module'

import { AddRewardAgentMetadataResponse } from '@rewards-system/rewards-rpc/abstractions'

import { RewardAgentSerializer }          from './reward-agent.serializer.js'

export class AddRewardAgentMetadataSerializer extends AddRewardAgentMetadataResponse {
  constructor(private readonly rewardAgent: RewardAgent) {
    super()
  }

  get result(): RewardAgentSerializer {
    return new RewardAgentSerializer(this.rewardAgent)
  }
}

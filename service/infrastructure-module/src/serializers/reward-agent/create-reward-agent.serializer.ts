import type { RewardAgent }          from '@rewards-system/domain-module'

import { CreateRewardAgentResponse } from '@rewards-system/rewards-rpc/abstractions'

import { RewardAgentSerializer }     from './reward-agent.serializer.js'

export class CreateRewardAgentSerializer extends CreateRewardAgentResponse {
  constructor(private readonly rewardAgent: RewardAgent) {
    super()
  }

  get result(): RewardAgentSerializer {
    return new RewardAgentSerializer(this.rewardAgent)
  }
}

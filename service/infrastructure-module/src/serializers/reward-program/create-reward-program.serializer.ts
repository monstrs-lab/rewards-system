import type { RewardProgram }          from '@rewards-system/domain-module'

import { CreateRewardProgramResponse } from '@rewards-system/rewards-rpc/abstractions'

import { RewardProgramSerializer }     from './reward-program.serializer.js'

export class CreateRewardProgramSerializer extends CreateRewardProgramResponse {
  constructor(private readonly rewardProgram: RewardProgram) {
    super()
  }

  get result(): RewardProgramSerializer {
    return new RewardProgramSerializer(this.rewardProgram)
  }
}

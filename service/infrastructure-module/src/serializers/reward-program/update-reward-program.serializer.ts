import type { RewardProgram }          from '@rewards-system/domain-module'

import { UpdateRewardProgramResponse } from '@rewards-system/rewards-system-rpc/abstractions'

import { RewardProgramSerializer }     from './reward-program.serializer.js'

export class UpdateRewardProgramSerializer extends UpdateRewardProgramResponse {
  constructor(private readonly rewardProgram: RewardProgram) {
    super()
  }

  get result(): RewardProgramSerializer {
    return new RewardProgramSerializer(this.rewardProgram)
  }
}
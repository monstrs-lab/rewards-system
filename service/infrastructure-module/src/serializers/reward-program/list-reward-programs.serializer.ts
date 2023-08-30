import type { RewardProgram }         from '@rewards-system/domain-module'

import { ListRewardProgramsResponse } from '@rewards-system/rewards-system-rpc/abstractions'

import { RewardProgramSerializer }    from './reward-program.serializer.js'

export class ListRewardProgramsSerializer extends ListRewardProgramsResponse {
  constructor(
    private readonly query: { rewardPrograms: Array<RewardProgram>; hasNextPage: boolean }
  ) {
    super()
  }

  get rewardPrograms(): Array<RewardProgramSerializer> {
    return this.query.rewardPrograms.map(
      (rewardProgram) => new RewardProgramSerializer(rewardProgram)
    )
  }

  get hasNextPage(): boolean {
    return this.query.hasNextPage
  }
}

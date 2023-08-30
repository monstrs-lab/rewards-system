import type { IQueryHandler }        from '@nestjs/cqrs'
import type { RewardProgram }        from '@rewards-system/domain-module'

import { QueryHandler }              from '@nestjs/cqrs'

import { RewardProgramRepository }   from '@rewards-system/domain-module'

import { GetRewardProgramByIdQuery } from '../../queries/index.js'

@QueryHandler(GetRewardProgramByIdQuery)
export class GetRewardProgramByIdQueryHandler implements IQueryHandler<GetRewardProgramByIdQuery> {
  constructor(private readonly rewardProgramRepository: RewardProgramRepository) {}

  async execute(query: GetRewardProgramByIdQuery): Promise<RewardProgram | undefined> {
    return this.rewardProgramRepository.findById(query.id)
  }
}

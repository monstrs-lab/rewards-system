import type { IQueryHandler }                   from '@nestjs/cqrs'
import type { FindRewardProgramsByQueryResult } from '@rewards-system/domain-module'

import { QueryHandler }                         from '@nestjs/cqrs'

import { RewardProgramRepository }              from '@rewards-system/domain-module'

import { GetRewardProgramsQuery }               from '../../queries/index.js'

@QueryHandler(GetRewardProgramsQuery)
export class GetRewardProgramsQueryHandler implements IQueryHandler<GetRewardProgramsQuery> {
  constructor(private readonly rewardProgramRepository: RewardProgramRepository) {}

  async execute({
    pager,
    order,
    query,
  }: GetRewardProgramsQuery): Promise<FindRewardProgramsByQueryResult> {
    return this.rewardProgramRepository.findByQuery({
      pager,
      order,
      query,
    })
  }
}

import type { IQueryHandler }            from '@nestjs/cqrs'
import type { FindRewardsByQueryResult } from '@rewards-system/domain-module'

import { QueryHandler }                  from '@nestjs/cqrs'

import { RewardRepository }              from '@rewards-system/domain-module'

import { GetRewardsQuery }               from '../../queries/index.js'

@QueryHandler(GetRewardsQuery)
export class GetRewardsQueryHandler implements IQueryHandler<GetRewardsQuery> {
  constructor(private readonly rewardRepository: RewardRepository) {}

  async execute({ pager, order, query }: GetRewardsQuery): Promise<FindRewardsByQueryResult> {
    return this.rewardRepository.findByQuery({
      pager,
      order,
      query,
    })
  }
}

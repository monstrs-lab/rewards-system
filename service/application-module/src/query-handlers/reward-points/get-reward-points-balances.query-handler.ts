import type { IQueryHandler }                         from '@nestjs/cqrs'
import type { FindRewardPointsBalancesByQueryResult } from '@rewards-system/domain-module'

import { QueryHandler }                               from '@nestjs/cqrs'

import { RewardPointsBalanceRepository }              from '@rewards-system/domain-module'

import { GetRewardPointsBalancesQuery }               from '../../queries/index.js'

@QueryHandler(GetRewardPointsBalancesQuery)
export class GetRewardPointsBalancesQueryHandler
  implements IQueryHandler<GetRewardPointsBalancesQuery>
{
  constructor(private readonly rewardPointsBalanceRepository: RewardPointsBalanceRepository) {}

  async execute({
    pager,
    order,
    query,
  }: GetRewardPointsBalancesQuery): Promise<FindRewardPointsBalancesByQueryResult> {
    return this.rewardPointsBalanceRepository.findByQuery({
      pager,
      order,
      query,
    })
  }
}

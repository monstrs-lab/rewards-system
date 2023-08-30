import type { IQueryHandler }                     from '@nestjs/cqrs'
import type { FindRewardOperationsByQueryResult } from '@rewards-system/domain-module'

import { QueryHandler }                           from '@nestjs/cqrs'

import { RewardOperationRepository }              from '@rewards-system/domain-module'

import { GetRewardOperationsQuery }               from '../../queries/index.js'

@QueryHandler(GetRewardOperationsQuery)
export class GetRewardOperationsQueryHandler implements IQueryHandler<GetRewardOperationsQuery> {
  constructor(private readonly rewardOperationRepository: RewardOperationRepository) {}

  async execute({
    pager,
    order,
    query,
  }: GetRewardOperationsQuery): Promise<FindRewardOperationsByQueryResult> {
    return this.rewardOperationRepository.findByQuery({
      pager,
      order,
      query,
    })
  }
}

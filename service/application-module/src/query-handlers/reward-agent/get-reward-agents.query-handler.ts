import type { IQueryHandler }                 from '@nestjs/cqrs'
import type { FindRewardAgentsByQueryResult } from '@rewards-system/domain-module'

import { QueryHandler }                       from '@nestjs/cqrs'

import { RewardAgentRepository }              from '@rewards-system/domain-module'

import { GetRewardAgentsQuery }               from '../../queries/index.js'

@QueryHandler(GetRewardAgentsQuery)
export class GetRewardAgentsQueryHandler implements IQueryHandler<GetRewardAgentsQuery> {
  constructor(private readonly rewardAgentRepository: RewardAgentRepository) {}

  async execute({
    pager,
    order,
    query,
  }: GetRewardAgentsQuery): Promise<FindRewardAgentsByQueryResult> {
    return this.rewardAgentRepository.findByQuery({
      pager,
      order,
      query,
    })
  }
}

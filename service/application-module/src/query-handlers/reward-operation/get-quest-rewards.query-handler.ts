import type { IQueryHandler }                 from '@nestjs/cqrs'
import type { FindQuestRewardsByQueryResult } from '@rewards-system/domain-module'

import { QueryHandler }                       from '@nestjs/cqrs'

import { QuestRewardRepository }              from '@rewards-system/domain-module'

import { GetQuestRewardsQuery }               from '../../queries/index.js'

@QueryHandler(GetQuestRewardsQuery)
export class GetQuestRewardsQueryHandler implements IQueryHandler<GetQuestRewardsQuery> {
  constructor(private readonly questRewardRepository: QuestRewardRepository) {}

  async execute({
    pager,
    order,
    query,
  }: GetQuestRewardsQuery): Promise<FindQuestRewardsByQueryResult> {
    return this.questRewardRepository.findByQuery({
      pager,
      order,
      query,
    })
  }
}

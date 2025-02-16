import type { IQueryHandler }      from '@nestjs/cqrs'
import type { QuestReward }        from '@rewards-system/domain-module'

import { QueryHandler }            from '@nestjs/cqrs'

import { QuestRewardRepository }   from '@rewards-system/domain-module'

import { GetQuestRewardByIdQuery } from '../../queries/index.js'

@QueryHandler(GetQuestRewardByIdQuery)
export class GetRewardByIdQueryHandler implements IQueryHandler<GetQuestRewardByIdQuery> {
  constructor(private readonly questRewardRepository: QuestRewardRepository) {}

  async execute(query: GetQuestRewardByIdQuery): Promise<QuestReward | undefined> {
    return this.questRewardRepository.findById(query.id)
  }
}

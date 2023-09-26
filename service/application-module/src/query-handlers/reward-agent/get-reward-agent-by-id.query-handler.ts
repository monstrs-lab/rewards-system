import type { IQueryHandler }      from '@nestjs/cqrs'
import type { RewardAgent }        from '@rewards-system/domain-module'

import { QueryHandler }            from '@nestjs/cqrs'

import { RewardAgentRepository }   from '@rewards-system/domain-module'

import { GetRewardAgentByIdQuery } from '../../queries/index.js'

@QueryHandler(GetRewardAgentByIdQuery)
export class GetRewardAgentByIdQueryHandler implements IQueryHandler<GetRewardAgentByIdQuery> {
  constructor(private readonly rewardAgentRepository: RewardAgentRepository) {}

  async execute(query: GetRewardAgentByIdQuery): Promise<RewardAgent | undefined> {
    return this.rewardAgentRepository.findById(query.id)
  }
}

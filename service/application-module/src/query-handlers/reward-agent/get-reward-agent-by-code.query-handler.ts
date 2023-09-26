import type { IQueryHandler }        from '@nestjs/cqrs'
import type { RewardAgent }          from '@rewards-system/domain-module'

import { QueryHandler }              from '@nestjs/cqrs'

import { RewardAgentRepository }     from '@rewards-system/domain-module'

import { GetRewardAgentByCodeQuery } from '../../queries/index.js'

@QueryHandler(GetRewardAgentByCodeQuery)
export class GetRewardAgentByCodeQueryHandler implements IQueryHandler<GetRewardAgentByCodeQuery> {
  constructor(private readonly rewardAgentRepository: RewardAgentRepository) {}

  async execute(query: GetRewardAgentByCodeQuery): Promise<RewardAgent | undefined> {
    return this.rewardAgentRepository.findByCode(query.code)
  }
}

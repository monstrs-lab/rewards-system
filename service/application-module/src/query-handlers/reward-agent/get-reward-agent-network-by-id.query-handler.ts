import type { IQueryHandler }             from '@nestjs/cqrs'
import type { RewardAgent }               from '@rewards-system/domain-module'

import { QueryHandler }                   from '@nestjs/cqrs'

import { RewardAgentRepository }          from '@rewards-system/domain-module'

import { GetRewardAgentNetworkByIdQuery } from '../../queries/index.js'

@QueryHandler(GetRewardAgentNetworkByIdQuery)
export class GetRewardAgentNetworkByIdQueryHandler
  implements IQueryHandler<GetRewardAgentNetworkByIdQuery>
{
  constructor(private readonly rewardAgentRepository: RewardAgentRepository) {}

  async execute(query: GetRewardAgentNetworkByIdQuery): Promise<Array<RewardAgent>> {
    const rewardAgent = await this.rewardAgentRepository.findById(query.id)

    return this.rewardAgentRepository.findDescendents(rewardAgent!)
  }
}

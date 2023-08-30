import type { IQueryHandler }          from '@nestjs/cqrs'
import type { RewardOperation }        from '@rewards-system/domain-module'

import { QueryHandler }                from '@nestjs/cqrs'

import { RewardOperationRepository }   from '@rewards-system/domain-module'

import { GetRewardOperationByIdQuery } from '../../queries/index.js'

@QueryHandler(GetRewardOperationByIdQuery)
export class GetRewardOperationByIdQueryHandler
  implements IQueryHandler<GetRewardOperationByIdQuery>
{
  constructor(private readonly rewardOperationRepository: RewardOperationRepository) {}

  async execute(query: GetRewardOperationByIdQuery): Promise<RewardOperation | undefined> {
    return this.rewardOperationRepository.findById(query.id)
  }
}

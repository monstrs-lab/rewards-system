import type { IQueryHandler }               from '@nestjs/cqrs'
import type { ReferralAgent }               from '@referral-programs/domain-module'

import { QueryHandler }                     from '@nestjs/cqrs'

import { ReferralAgentRepository }          from '@referral-programs/domain-module'

import { GetReferralAgentNetworkByIdQuery } from '../queries/index.js'

@QueryHandler(GetReferralAgentNetworkByIdQuery)
export class GetReferralAgentNetworkByIdQueryHandler
  implements IQueryHandler<GetReferralAgentNetworkByIdQuery>
{
  constructor(private readonly referralAgentRepository: ReferralAgentRepository) {}

  async execute(query: GetReferralAgentNetworkByIdQuery): Promise<Array<ReferralAgent>> {
    const referralAgent = await this.referralAgentRepository.findById(query.id)

    return this.referralAgentRepository.findDescendents(referralAgent!)
  }
}

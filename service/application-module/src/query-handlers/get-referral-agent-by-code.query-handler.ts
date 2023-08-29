import type { IQueryHandler }          from '@nestjs/cqrs'
import type { ReferralAgent }          from '@referral-programs/domain-module'

import { QueryHandler }                from '@nestjs/cqrs'

import { ReferralAgentRepository }     from '@referral-programs/domain-module'

import { GetReferralAgentByCodeQuery } from '../queries/index.js'

@QueryHandler(GetReferralAgentByCodeQuery)
export class GetReferralAgentByCodeQueryHandler
  implements IQueryHandler<GetReferralAgentByCodeQuery>
{
  constructor(private readonly referralAgentRepository: ReferralAgentRepository) {}

  async execute(query: GetReferralAgentByCodeQuery): Promise<ReferralAgent | undefined> {
    return this.referralAgentRepository.findByCode(query.code)
  }
}

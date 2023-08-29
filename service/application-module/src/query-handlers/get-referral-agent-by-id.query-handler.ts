import type { IQueryHandler }        from '@nestjs/cqrs'
import type { ReferralAgent }        from '@referral-programs/domain-module'

import { QueryHandler }              from '@nestjs/cqrs'

import { ReferralAgentRepository }   from '@referral-programs/domain-module'

import { GetReferralAgentByIdQuery } from '../queries/index.js'

@QueryHandler(GetReferralAgentByIdQuery)
export class GetReferralAgentByIdQueryHandler implements IQueryHandler<GetReferralAgentByIdQuery> {
  constructor(private readonly referralAgentRepository: ReferralAgentRepository) {}

  async execute(query: GetReferralAgentByIdQuery): Promise<ReferralAgent | undefined> {
    return this.referralAgentRepository.findById(query.id)
  }
}

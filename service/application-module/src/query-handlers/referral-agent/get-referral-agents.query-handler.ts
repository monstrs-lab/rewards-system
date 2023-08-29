import type { IQueryHandler }                   from '@nestjs/cqrs'
import type { FindReferralAgentsByQueryResult } from '@referral-programs/domain-module'

import { QueryHandler }                         from '@nestjs/cqrs'

import { ReferralAgentRepository }              from '@referral-programs/domain-module'

import { GetReferralAgentsQuery }               from '../../queries/index.js'

@QueryHandler(GetReferralAgentsQuery)
export class GetReferralAgentsQueryHandler implements IQueryHandler<GetReferralAgentsQuery> {
  constructor(private readonly referralAgentRepository: ReferralAgentRepository) {}

  async execute({
    pager,
    order,
    query,
  }: GetReferralAgentsQuery): Promise<FindReferralAgentsByQueryResult> {
    return this.referralAgentRepository.findByQuery({
      pager,
      order,
      query,
    })
  }
}

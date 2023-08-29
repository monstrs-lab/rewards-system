import type { IQueryHandler }                     from '@nestjs/cqrs'
import type { FindReferralProgramsByQueryResult } from '@referral-programs/domain-module'

import { QueryHandler }                           from '@nestjs/cqrs'

import { ReferralProgramRepository }              from '@referral-programs/domain-module'

import { GetReferralProgramsQuery }               from '../../queries/index.js'

@QueryHandler(GetReferralProgramsQuery)
export class GetReferralProgramsQueryHandler implements IQueryHandler<GetReferralProgramsQuery> {
  constructor(private readonly referralProgramRepository: ReferralProgramRepository) {}

  async execute({
    pager,
    order,
    query,
  }: GetReferralProgramsQuery): Promise<FindReferralProgramsByQueryResult> {
    return this.referralProgramRepository.findByQuery({
      pager,
      order,
      query,
    })
  }
}

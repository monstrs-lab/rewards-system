import type { IQueryHandler }                    from '@nestjs/cqrs'
import type { FindReferralProfitsByQueryResult } from '@referral-programs/domain-module'

import { QueryHandler }                          from '@nestjs/cqrs'

import { ReferralProfitRepository }              from '@referral-programs/domain-module'

import { GetReferralProfitsQuery }               from '../../queries/index.js'

@QueryHandler(GetReferralProfitsQuery)
export class GetReferralProfitsQueryHandler implements IQueryHandler<GetReferralProfitsQuery> {
  constructor(private readonly referralProfitRepository: ReferralProfitRepository) {}

  async execute({
    pager,
    order,
    query,
  }: GetReferralProfitsQuery): Promise<FindReferralProfitsByQueryResult> {
    return this.referralProfitRepository.findByQuery({
      pager,
      order,
      query,
    })
  }
}

import type { IQueryHandler }                           from '@nestjs/cqrs'
import type { FindReferralPointsBalancesByQueryResult } from '@referral-programs/domain-module'

import { QueryHandler }                                 from '@nestjs/cqrs'

import { ReferralPointsBalanceRepository }              from '@referral-programs/domain-module'

import { GetReferralPointsBalancesQuery }               from '../../queries/index.js'

@QueryHandler(GetReferralPointsBalancesQuery)
export class GetReferralPointsBalancesQueryHandler
  implements IQueryHandler<GetReferralPointsBalancesQuery>
{
  constructor(private readonly referralPointsBalanceRepository: ReferralPointsBalanceRepository) {}

  async execute({
    pager,
    order,
    query,
  }: GetReferralPointsBalancesQuery): Promise<FindReferralPointsBalancesByQueryResult> {
    return this.referralPointsBalanceRepository.findByQuery({
      pager,
      order,
      query,
    })
  }
}

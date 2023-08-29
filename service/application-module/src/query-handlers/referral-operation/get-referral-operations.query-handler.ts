import type { IQueryHandler }                       from '@nestjs/cqrs'
import type { FindReferralOperationsByQueryResult } from '@referral-programs/domain-module'

import { QueryHandler }                             from '@nestjs/cqrs'

import { ReferralOperationRepository }              from '@referral-programs/domain-module'

import { GetReferralOperationsQuery }               from '../../queries/index.js'

@QueryHandler(GetReferralOperationsQuery)
export class GetReferralOperationsQueryHandler
  implements IQueryHandler<GetReferralOperationsQuery>
{
  constructor(private readonly referralOperationRepository: ReferralOperationRepository) {}

  async execute({
    pager,
    order,
    query,
  }: GetReferralOperationsQuery): Promise<FindReferralOperationsByQueryResult> {
    return this.referralOperationRepository.findByQuery({
      pager,
      order,
      query,
    })
  }
}

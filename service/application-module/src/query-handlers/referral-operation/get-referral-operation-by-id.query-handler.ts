import type { IQueryHandler }            from '@nestjs/cqrs'
import type { ReferralOperation }        from '@referral-programs/domain-module'

import { QueryHandler }                  from '@nestjs/cqrs'

import { ReferralOperationRepository }   from '@referral-programs/domain-module'

import { GetReferralOperationByIdQuery } from '../../queries/index.js'

@QueryHandler(GetReferralOperationByIdQuery)
export class GetReferralOperationByIdQueryHandler
  implements IQueryHandler<GetReferralOperationByIdQuery>
{
  constructor(private readonly referralOperationRepository: ReferralOperationRepository) {}

  async execute(query: GetReferralOperationByIdQuery): Promise<ReferralOperation | undefined> {
    return this.referralOperationRepository.findById(query.id)
  }
}

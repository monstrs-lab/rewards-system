import type { IQueryHandler }          from '@nestjs/cqrs'
import type { ReferralProgram }        from '@referral-programs/domain-module'

import { QueryHandler }                from '@nestjs/cqrs'

import { ReferralProgramRepository }   from '@referral-programs/domain-module'

import { GetReferralProgramByIdQuery } from '../queries/index.js'

@QueryHandler(GetReferralProgramByIdQuery)
export class GetReferralProgramByIdQueryHandler
  implements IQueryHandler<GetReferralProgramByIdQuery>
{
  constructor(private readonly referralProgramRepository: ReferralProgramRepository) {}

  async execute(query: GetReferralProgramByIdQuery): Promise<ReferralProgram | undefined> {
    return this.referralProgramRepository.findById(query.id)
  }
}

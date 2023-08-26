import type { ReferralProgram }         from '@referral-programs/domain-module'

import { ListReferralProgramsResponse } from '@referral-programs/referral-programs-rpc/abstractions'

import { ReferralProgramSerializer }    from './referral-program.serializer.js'

export class ListReferralProgramsSerializer extends ListReferralProgramsResponse {
  constructor(
    private readonly query: { referralPrograms: Array<ReferralProgram>; hasNextPage: boolean }
  ) {
    super()
  }

  get referralPrograms(): Array<ReferralProgramSerializer> {
    return this.query.referralPrograms.map(
      (referralProgram) => new ReferralProgramSerializer(referralProgram)
    )
  }

  get hasNextPage(): boolean {
    return this.query.hasNextPage
  }
}

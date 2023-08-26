import type { ReferralProgram }          from '@referral-programs/domain-module'

import { CreateReferralProgramResponse } from '@referral-programs/referral-programs-rpc/abstractions'

import { ReferralProgramSerializer }     from './referral-program.serializer.js'

export class CreateReferralProgramSerializer extends CreateReferralProgramResponse {
  constructor(private readonly referralProgram: ReferralProgram) {
    super()
  }

  get result(): ReferralProgramSerializer {
    return new ReferralProgramSerializer(this.referralProgram)
  }
}

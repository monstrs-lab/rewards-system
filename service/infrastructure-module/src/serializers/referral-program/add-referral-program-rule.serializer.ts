import type { ReferralProgram }           from '@referral-programs/domain-module'

import { AddReferralProgramRuleResponse } from '@referral-programs/referral-programs-rpc/abstractions'

import { ReferralProgramSerializer }      from './referral-program.serializer.js'

export class AddReferralProgramRuleSerializer extends AddReferralProgramRuleResponse {
  constructor(private readonly referralProgram: ReferralProgram) {
    super()
  }

  get result(): ReferralProgramSerializer {
    return new ReferralProgramSerializer(this.referralProgram)
  }
}

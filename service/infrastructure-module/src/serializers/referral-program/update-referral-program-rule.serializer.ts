import type { ReferralProgram }              from '@referral-programs/domain-module'

import { UpdateReferralProgramRuleResponse } from '@referral-programs/referral-programs-rpc/abstractions'

import { ReferralProgramSerializer }         from './referral-program.serializer.js'

export class UpdateReferralProgramRuleSerializer extends UpdateReferralProgramRuleResponse {
  constructor(private readonly referralProgram: ReferralProgram) {
    super()
  }

  get result(): ReferralProgramSerializer {
    return new ReferralProgramSerializer(this.referralProgram)
  }
}

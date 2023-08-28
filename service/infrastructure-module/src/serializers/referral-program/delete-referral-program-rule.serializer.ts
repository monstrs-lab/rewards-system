import type { ReferralProgram }              from '@referral-programs/domain-module'

import { DeleteReferralProgramRuleResponse } from '@referral-programs/referral-programs-rpc/abstractions'

import { ReferralProgramSerializer }         from './referral-program.serializer.js'

export class DeleteReferralProgramRuleSerializer extends DeleteReferralProgramRuleResponse {
  constructor(private readonly referralProgram: ReferralProgram) {
    super()
  }

  get result(): ReferralProgramSerializer {
    return new ReferralProgramSerializer(this.referralProgram)
  }
}

import type { ReferralAgent }          from '@referral-programs/domain-module'

import { CreateReferralAgentResponse } from '@referral-programs/referral-programs-rpc/abstractions'

import { ReferralAgentSerializer }     from './referral-agent.serializer.js'

export class CreateReferralAgentSerializer extends CreateReferralAgentResponse {
  constructor(private readonly referralAgent: ReferralAgent) {
    super()
  }

  get result(): ReferralAgentSerializer {
    return new ReferralAgentSerializer(this.referralAgent)
  }
}

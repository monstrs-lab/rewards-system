import type { ReferralAgent } from '@referral-programs/domain-module'
import type { JsonValue }     from '@referral-programs/referral-programs-rpc'

import * as rpc               from '@referral-programs/referral-programs-rpc/abstractions'
import { Struct }             from '@referral-programs/referral-programs-rpc'

export class ReferralAgentSerializer extends rpc.ReferralAgent {
  constructor(private readonly referralAgent: ReferralAgent) {
    super()
  }

  get id(): string {
    return this.referralAgent.id
  }

  get code(): string {
    return this.referralAgent.code
  }

  get parentId(): string | undefined {
    return this.referralAgent.parentId
  }

  get metadata(): Struct {
    return Struct.fromJson(this.referralAgent.metadata as JsonValue)
  }
}

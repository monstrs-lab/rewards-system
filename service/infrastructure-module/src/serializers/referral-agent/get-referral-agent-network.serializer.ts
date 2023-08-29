import type { ReferralAgent }              from '@referral-programs/domain-module'

import { GetReferralAgentNetworkResponse } from '@referral-programs/referral-programs-rpc/abstractions'

import { ReferralAgentSerializer }         from './referral-agent.serializer.js'

export class GetReferralAgentNetworkSerializer extends GetReferralAgentNetworkResponse {
  constructor(private readonly query: Array<ReferralAgent>) {
    super()
  }

  get referralAgents(): Array<ReferralAgentSerializer> {
    return this.query.map((referralAgent) => new ReferralAgentSerializer(referralAgent))
  }
}

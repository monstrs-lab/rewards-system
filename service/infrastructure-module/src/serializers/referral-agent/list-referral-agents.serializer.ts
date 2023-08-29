import type { ReferralAgent }         from '@referral-programs/domain-module'

import { ListReferralAgentsResponse } from '@referral-programs/referral-programs-rpc/abstractions'

import { ReferralAgentSerializer }    from './referral-agent.serializer.js'

export class ListReferralAgentsSerializer extends ListReferralAgentsResponse {
  constructor(
    private readonly query: { referralAgents: Array<ReferralAgent>; hasNextPage: boolean }
  ) {
    super()
  }

  get referralAgents(): Array<ReferralAgentSerializer> {
    return this.query.referralAgents.map(
      (referralAgent) => new ReferralAgentSerializer(referralAgent)
    )
  }

  get hasNextPage(): boolean {
    return this.query.hasNextPage
  }
}

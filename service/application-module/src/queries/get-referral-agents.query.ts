import type { FindReferralAgentsByQuery } from '@referral-programs/domain-module'

export class GetReferralAgentsQuery {
  constructor(
    public readonly pager?: FindReferralAgentsByQuery['pager'],
    public readonly order?: FindReferralAgentsByQuery['order'],
    public readonly query?: FindReferralAgentsByQuery['query']
  ) {}
}

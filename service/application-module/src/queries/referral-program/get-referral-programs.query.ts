import type { FindReferralProgramsByQuery } from '@referral-programs/domain-module'

export class GetReferralProgramsQuery {
  constructor(
    public readonly pager?: FindReferralProgramsByQuery['pager'],
    public readonly order?: FindReferralProgramsByQuery['order'],
    public readonly query?: FindReferralProgramsByQuery['query']
  ) {}
}

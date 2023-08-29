import type { FindReferralOperationsByQuery } from '@referral-programs/domain-module'

export class GetReferralOperationsQuery {
  constructor(
    public readonly pager?: FindReferralOperationsByQuery['pager'],
    public readonly order?: FindReferralOperationsByQuery['order'],
    public readonly query?: FindReferralOperationsByQuery['query']
  ) {}
}

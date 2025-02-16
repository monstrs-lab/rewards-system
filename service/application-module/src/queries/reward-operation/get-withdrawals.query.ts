import type { FindWithdrawalsByQuery } from '@rewards-system/domain-module'

export class GetWithdrawalsQuery {
  constructor(
    public readonly pager?: FindWithdrawalsByQuery['pager'],
    public readonly order?: FindWithdrawalsByQuery['order'],
    public readonly query?: FindWithdrawalsByQuery['query']
  ) {}
}

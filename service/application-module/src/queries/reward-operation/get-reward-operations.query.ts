import type { FindRewardOperationsByQuery } from '@rewards-system/domain-module'

export class GetRewardOperationsQuery {
  constructor(
    public readonly pager?: FindRewardOperationsByQuery['pager'],
    public readonly order?: FindRewardOperationsByQuery['order'],
    public readonly query?: FindRewardOperationsByQuery['query']
  ) {}
}

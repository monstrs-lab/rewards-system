import type { FindRewardAgentsByQuery } from '@rewards-system/domain-module'

export class GetRewardAgentsQuery {
  constructor(
    public readonly pager?: FindRewardAgentsByQuery['pager'],
    public readonly order?: FindRewardAgentsByQuery['order'],
    public readonly query?: FindRewardAgentsByQuery['query']
  ) {}
}

import type { FindRewardProgramsByQuery } from '@rewards-system/domain-module'

export class GetRewardProgramsQuery {
  constructor(
    public readonly pager?: FindRewardProgramsByQuery['pager'],
    public readonly order?: FindRewardProgramsByQuery['order'],
    public readonly query?: FindRewardProgramsByQuery['query']
  ) {}
}

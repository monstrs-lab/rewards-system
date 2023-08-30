import type { Query }           from '@monstrs/query-types'

import type { RewardOperation } from '../aggregates/index.js'

export interface RewardOperationsQuery {
  id?: Query.IDType
}

export interface FindRewardOperationsByQuery {
  pager?: Query.Pager
  order?: Query.Order
  query?: RewardOperationsQuery
}

export interface FindRewardOperationsByQueryResult {
  rewardOperations: Array<RewardOperation>
  hasNextPage: boolean
}

export abstract class RewardOperationRepository {
  abstract save(aggregate: RewardOperation): Promise<void>

  abstract findById(id: string): Promise<RewardOperation | undefined>

  abstract findByQuery(
    query: FindRewardOperationsByQuery
  ): Promise<FindRewardOperationsByQueryResult>
}

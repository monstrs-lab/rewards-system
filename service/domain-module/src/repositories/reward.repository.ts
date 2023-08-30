import type { Query }  from '@monstrs/query-types'

import type { Reward } from '../aggregates/index.js'

export interface RewardsQuery {
  id?: Query.IDType
  agentId?: Query.IDType
  operationId?: Query.IDType
}

export interface FindRewardsByQuery {
  pager?: Query.Pager
  order?: Query.Order
  query?: RewardsQuery
}

export interface FindRewardsByQueryResult {
  rewards: Array<Reward>
  hasNextPage: boolean
}

export abstract class RewardRepository {
  abstract save(aggregate: Reward): Promise<void>

  abstract findById(id: string): Promise<Reward | undefined>

  abstract findByOperationId(operationId: string): Promise<Array<Reward>>

  abstract findByQuery(query: FindRewardsByQuery): Promise<FindRewardsByQueryResult>
}

import type { Query }               from '@monstrs/query-types'

import type { RewardPointsBalance } from '../aggregates/index.js'

export interface RewardPointsBalancesQuery {
  id?: Query.IDType
}

export interface FindRewardPointsBalancesByQuery {
  pager?: Query.Pager
  order?: Query.Order
  query?: RewardPointsBalancesQuery
}

export interface FindRewardPointsBalancesByQueryResult {
  rewardPointsBalances: Array<RewardPointsBalance>
  hasNextPage: boolean
}

export abstract class RewardPointsBalanceRepository {
  abstract save(aggregate: RewardPointsBalance): Promise<void>

  abstract findById(id: string): Promise<RewardPointsBalance | undefined>

  abstract findByQuery(
    query: FindRewardPointsBalancesByQuery
  ): Promise<FindRewardPointsBalancesByQueryResult>
}

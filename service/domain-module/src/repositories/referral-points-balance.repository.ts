import type { Query }                 from '@monstrs/query-types'

import type { ReferralPointsBalance } from '../aggregates/index.js'

export interface ReferralPointsBalancesQuery {
  id?: Query.IDType
}

export interface FindReferralPointsBalancesByQuery {
  pager?: Query.Pager
  order?: Query.Order
  query?: ReferralPointsBalancesQuery
}

export interface FindReferralPointsBalancesByQueryResult {
  referralPointsBalances: Array<ReferralPointsBalance>
  hasNextPage: boolean
}

export abstract class ReferralPointsBalanceRepository {
  abstract save(aggregate: ReferralPointsBalance): Promise<void>

  abstract findById(id: string): Promise<ReferralPointsBalance | undefined>

  abstract findByQuery(
    query: FindReferralPointsBalancesByQuery
  ): Promise<FindReferralPointsBalancesByQueryResult>
}

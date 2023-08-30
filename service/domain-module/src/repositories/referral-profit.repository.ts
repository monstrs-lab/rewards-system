import type { Query }          from '@monstrs/query-types'

import type { ReferralProfit } from '../aggregates/index.js'

export interface ReferralProfitsQuery {
  id?: Query.IDType
  agentId?: Query.IDType
  operationId?: Query.IDType
}

export interface FindReferralProfitsByQuery {
  pager?: Query.Pager
  order?: Query.Order
  query?: ReferralProfitsQuery
}

export interface FindReferralProfitsByQueryResult {
  referralProfits: Array<ReferralProfit>
  hasNextPage: boolean
}

export abstract class ReferralProfitRepository {
  abstract save(aggregate: ReferralProfit): Promise<void>

  abstract findById(id: string): Promise<ReferralProfit | undefined>

  abstract findByOperationId(operationId: string): Promise<Array<ReferralProfit>>

  abstract findByQuery(query: FindReferralProfitsByQuery): Promise<FindReferralProfitsByQueryResult>
}

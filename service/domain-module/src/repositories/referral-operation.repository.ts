import type { Query }             from '@monstrs/query-types'

import type { ReferralOperation } from '../aggregates/index.js'

export interface ReferralOperationsQuery {
  id?: Query.IDType
}

export interface FindReferralOperationsByQuery {
  pager?: Query.Pager
  order?: Query.Order
  query?: ReferralOperationsQuery
}

export interface FindReferralOperationsByQueryResult {
  referralOperations: Array<ReferralOperation>
  hasNextPage: boolean
}

export abstract class ReferralOperationRepository {
  abstract save(aggregate: ReferralOperation): Promise<void>

  abstract findById(id: string): Promise<ReferralOperation | undefined>

  abstract findByQuery(
    query: FindReferralOperationsByQuery
  ): Promise<FindReferralOperationsByQueryResult>
}

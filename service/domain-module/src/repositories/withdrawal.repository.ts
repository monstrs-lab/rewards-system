import type { Query }      from '@monstrs/query-types'

import type { Withdrawal } from '../aggregates/index.js'

export interface WithdrawalsQuery {
  id?: Query.IDType
  ownerId?: Query.IDType
}

export interface FindWithdrawalsByQuery {
  pager?: Query.Pager
  order?: Query.Order
  query?: WithdrawalsQuery
}

export interface FindWithdrawalsByQueryResult {
  withdrawals: Array<Withdrawal>
  hasNextPage: boolean
}

export abstract class WithdrawalRepository {
  abstract save(aggregate: Withdrawal): Promise<void>

  abstract findById(id: string): Promise<Withdrawal | undefined>

  abstract findByQuery(query: FindWithdrawalsByQuery): Promise<FindWithdrawalsByQueryResult>
}

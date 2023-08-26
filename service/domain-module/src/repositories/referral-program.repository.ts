import type { Query }           from '@monstrs/query-types'

import type { ReferralProgram } from '../aggregates/index.js'

export interface ReferralProgramsQuery {
  id?: Query.IDType
}

export interface FindReferralProgramsByQuery {
  pager?: Query.Pager
  order?: Query.Order
  query?: ReferralProgramsQuery
}

export interface FindReferralProgramsByQueryResult {
  referralPrograms: Array<ReferralProgram>
  hasNextPage: boolean
}

export abstract class ReferralProgramRepository {
  abstract save(aggregate: ReferralProgram): Promise<void>

  abstract findById(id: string): Promise<ReferralProgram | undefined>

  abstract findByCode(code: string): Promise<ReferralProgram | undefined>

  abstract findByQuery(
    query: FindReferralProgramsByQuery
  ): Promise<FindReferralProgramsByQueryResult>
}

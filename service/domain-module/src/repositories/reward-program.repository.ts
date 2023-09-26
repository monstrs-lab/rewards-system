import type { Query }         from '@monstrs/query-types'

import type { RewardProgram } from '../aggregates/index.js'

export interface RewardProgramsQuery {
  id?: Query.IDType
}

export interface FindRewardProgramsByQuery {
  pager?: Query.Pager
  order?: Query.Order
  query?: RewardProgramsQuery
}

export interface FindRewardProgramsByQueryResult {
  rewardPrograms: Array<RewardProgram>
  hasNextPage: boolean
}

export abstract class RewardProgramRepository {
  abstract save(aggregate: RewardProgram): Promise<void>

  abstract findById(id: string): Promise<RewardProgram | undefined>

  abstract findByCode(code: string): Promise<RewardProgram | undefined>

  abstract findByQuery(query: FindRewardProgramsByQuery): Promise<FindRewardProgramsByQueryResult>
}

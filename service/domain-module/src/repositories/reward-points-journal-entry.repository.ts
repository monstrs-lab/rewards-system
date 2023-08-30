import type { Query }                    from '@monstrs/query-types'

import type { RewardPointsJournalEntry } from '../aggregates/index.js'

export interface RewardPointsJournalEntriesQuery {
  id?: Query.IDType
}

export interface FindRewardPointsJournalEntriesByQuery {
  pager?: Query.Pager
  order?: Query.Order
  query?: RewardPointsJournalEntriesQuery
}

export interface FindRewardPointsJournalEntriesByQueryResult {
  rewardPointsJournalEntries: Array<RewardPointsJournalEntry>
  hasNextPage: boolean
}

export abstract class RewardPointsJournalEntryRepository {
  abstract save(aggregate: RewardPointsJournalEntry): Promise<void>

  abstract findById(id: string): Promise<RewardPointsJournalEntry | undefined>

  abstract findByQuery(
    query: FindRewardPointsJournalEntriesByQuery
  ): Promise<FindRewardPointsJournalEntriesByQueryResult>

  abstract calculateBookAccountBalance(bookId: string, account: string): Promise<number>
}

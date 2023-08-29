import type { Query }                      from '@monstrs/query-types'

import type { ReferralPointsJournalEntry } from '../aggregates/index.js'

export interface ReferralPointsJournalEntriesQuery {
  id?: Query.IDType
}

export interface FindReferralPointsJournalEntriesByQuery {
  pager?: Query.Pager
  order?: Query.Order
  query?: ReferralPointsJournalEntriesQuery
}

export interface FindReferralPointsJournalEntriesByQueryResult {
  referralPointsJournalEntries: Array<ReferralPointsJournalEntry>
  hasNextPage: boolean
}

export abstract class ReferralPointsJournalEntryRepository {
  abstract save(aggregate: ReferralPointsJournalEntry): Promise<void>

  abstract findById(id: string): Promise<ReferralPointsJournalEntry | undefined>

  abstract findByQuery(
    query: FindReferralPointsJournalEntriesByQuery
  ): Promise<FindReferralPointsJournalEntriesByQueryResult>

  abstract calculateBookAccountBalance(bookId: string, account: string): Promise<number>
}

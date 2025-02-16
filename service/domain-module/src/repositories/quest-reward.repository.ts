import type { Query }             from '@monstrs/query-types'

import type { QuestReward }       from '../aggregates/index.js'
import type { QuestRewardSource } from '../entities/index.js'

export interface QuestRewardsQuery {
  id?: Query.IDType
  recipientId?: Query.IDType
}

export interface FindQuestRewardsByQuery {
  pager?: Query.Pager
  order?: Query.Order
  query?: QuestRewardsQuery
}

export interface FindQuestRewardsByQueryResult {
  rewards: Array<QuestReward>
  hasNextPage: boolean
}

export abstract class QuestRewardRepository {
  abstract save(aggregate: QuestReward): Promise<void>

  abstract findById(id: string): Promise<QuestReward | undefined>

  abstract findByRecipinetAndSource(
    recipientId: string,
    source: QuestRewardSource
  ): Promise<QuestReward | undefined>

  abstract findByQuery(query: FindQuestRewardsByQuery): Promise<FindQuestRewardsByQueryResult>
}

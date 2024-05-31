import type { Rel }                       from '@mikro-orm/core'

import { Entity }                         from '@mikro-orm/core'
import { Property }                       from '@mikro-orm/core'
import { PrimaryKey }                     from '@mikro-orm/core'
import { ManyToOne }                      from '@mikro-orm/core'
import { BaseEntity }                     from '@mikro-orm/core'

import { RewardPointsJournalEntryEntity } from './reward-points-journal-entry.entity.js'

@Entity({ tableName: 'reward_points_transactions' })
export class RewardPointsTransactionEntity extends BaseEntity<RewardPointsTransactionEntity, 'id'> {
  @PrimaryKey({ type: 'uuid' })
  id!: string

  @Property({ type: 'uuid' })
  bookId!: string

  @Property()
  account!: string

  @Property({ type: 'decimal', precision: 12, scale: 2 })
  credit!: string

  @Property({ type: 'decimal', precision: 12, scale: 2 })
  debit!: string

  @ManyToOne(() => RewardPointsJournalEntryEntity)
  journalEntry!: Rel<RewardPointsJournalEntryEntity>
}

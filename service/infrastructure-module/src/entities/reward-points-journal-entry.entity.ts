import { Entity }                        from '@mikro-orm/core'
import { Property }                      from '@mikro-orm/core'
import { PrimaryKey }                    from '@mikro-orm/core'
import { OneToMany }                     from '@mikro-orm/core'
import { Collection }                    from '@mikro-orm/core'
import { Cascade }                       from '@mikro-orm/core'
import { BaseEntity }                    from '@mikro-orm/core'

import { RewardPointsTransactionEntity } from './reward-points-transaction.entity.js'

@Entity({ tableName: 'reward_points_journal_entries' })
export class RewardPointsJournalEntryEntity extends BaseEntity<
  RewardPointsJournalEntryEntity,
  'id'
> {
  @PrimaryKey({ type: 'uuid' })
  id!: string

  @Property({ type: 'uuid' })
  bookId!: string

  @Property({ type: 'uuid' })
  rewardId!: string

  @Property()
  number!: string

  @OneToMany({
    entity: () => RewardPointsTransactionEntity,
    mappedBy: 'journalEntry',
    cascade: [Cascade.ALL],
    orphanRemoval: true,
    eager: true,
  })
  transactions = new Collection<RewardPointsTransactionEntity>(this)
}

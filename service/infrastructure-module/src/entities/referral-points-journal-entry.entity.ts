import { Entity }                          from '@mikro-orm/core'
import { Property }                        from '@mikro-orm/core'
import { PrimaryKey }                      from '@mikro-orm/core'
import { OneToMany }                       from '@mikro-orm/core'
import { Collection }                      from '@mikro-orm/core'
import { Cascade }                         from '@mikro-orm/core'
import { BaseEntity }                      from '@mikro-orm/core'

import { ReferralPointsTransactionEntity } from './referral-points-transaction.entity.js'

@Entity({ tableName: 'referral_points_journal_entries' })
export class ReferralPointsJournalEntryEntity extends BaseEntity<
  ReferralPointsJournalEntryEntity,
  'id'
> {
  @PrimaryKey({ type: 'uuid' })
  id!: string

  @Property({ type: 'uuid' })
  bookId!: string

  @Property({ type: 'uuid' })
  profitId!: string

  @Property()
  number!: string

  @OneToMany({
    entity: () => ReferralPointsTransactionEntity,
    mappedBy: 'journalEntry',
    cascade: [Cascade.ALL],
    orphanRemoval: true,
    eager: true,
  })
  transactions = new Collection<ReferralPointsTransactionEntity>(this)
}

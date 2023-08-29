/* eslint-disable @typescript-eslint/consistent-type-imports */

import type { Rel }                         from '@mikro-orm/core'

import { Entity }                           from '@mikro-orm/core'
import { Property }                         from '@mikro-orm/core'
import { PrimaryKey }                       from '@mikro-orm/core'
import { ManyToOne }                        from '@mikro-orm/core'
import { BaseEntity }                       from '@mikro-orm/core'

import { ReferralPointsJournalEntryEntity } from './referral-points-journal-entry.entity.js'

@Entity({ tableName: 'referral_points_transactions' })
export class ReferralPointsTransactionEntity extends BaseEntity<
  ReferralPointsTransactionEntity,
  'id'
> {
  @PrimaryKey({ type: 'uuid' })
  id!: string

  @Property({ type: 'uuid' })
  bookId!: string

  @Property()
  account!: string

  @Property({ type: 'decimal', precision: 12, scale: 2 })
  credit!: number

  @Property({ type: 'decimal', precision: 12, scale: 2 })
  debit!: number

  @ManyToOne(() => ReferralPointsJournalEntryEntity)
  journalEntry!: Rel<ReferralPointsJournalEntryEntity>
}

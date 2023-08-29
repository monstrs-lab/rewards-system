import { Entity }                                from '@mikro-orm/core'
import { Property }                              from '@mikro-orm/core'
import { PrimaryKey }                            from '@mikro-orm/core'
import { Enum }                                  from '@mikro-orm/core'
import { Embedded }                              from '@mikro-orm/core'
import { BaseEntity }                            from '@mikro-orm/core'

import { ReferralOperationStatus }               from '@referral-programs/domain-module'

import { ReferralOperationSourceEmbeddedEntity } from '../embedded-entities/index.js'

@Entity({ tableName: 'referral_operations' })
export class ReferralOperationEntity extends BaseEntity<ReferralOperationEntity, 'id'> {
  @PrimaryKey({ type: 'uuid' })
  id!: string

  @Property({ type: 'uuid' })
  referralProgramId!: string

  @Property({ type: 'uuid' })
  referrerId!: string

  @Enum({
    items: () => ReferralOperationStatus,
    type: 'smallint',
    default: ReferralOperationStatus.PENDING,
  })
  status: ReferralOperationStatus = ReferralOperationStatus.PENDING

  @Embedded(() => ReferralOperationSourceEmbeddedEntity)
  source!: ReferralOperationSourceEmbeddedEntity

  @Property({ type: 'decimal', precision: 12, scale: 2 })
  amount!: number

  @Property({ type: 'timestamptz' })
  createdAt!: Date
}

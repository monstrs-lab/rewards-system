import { Entity }                  from '@mikro-orm/core'
import { Property }                from '@mikro-orm/core'
import { PrimaryKey }              from '@mikro-orm/core'
import { Enum }                    from '@mikro-orm/core'
import { BaseEntity }              from '@mikro-orm/core'

import { ReferralOperationStatus } from '@referral-programs/domain-module'

@Entity({ tableName: 'referral_profits' })
export class ReferralProfitEntity extends BaseEntity<ReferralProfitEntity, 'id'> {
  @PrimaryKey({ type: 'uuid' })
  id!: string

  @Enum({
    items: () => ReferralOperationStatus,
    type: 'smallint',
    default: ReferralOperationStatus.PENDING,
  })
  status: ReferralOperationStatus = ReferralOperationStatus.PENDING

  @Property({ type: 'uuid' })
  operationId!: string

  @Property({ type: 'uuid' })
  agentId!: string

  @Property({ type: 'uuid' })
  referrerId!: string

  @Property()
  level!: number

  @Property({ type: 'decimal', precision: 12, scale: 2 })
  amount!: number

  @Property({ type: 'decimal', precision: 12, scale: 2 })
  profit!: number

  @Property()
  percentage!: number

  @Property({ type: 'timestamptz' })
  createdAt!: Date
}

import { Entity }                from '@mikro-orm/core'
import { Property }              from '@mikro-orm/core'
import { PrimaryKey }            from '@mikro-orm/core'
import { Enum }                  from '@mikro-orm/core'
import { BaseEntity }            from '@mikro-orm/core'

import { RewardOperationStatus } from '@rewards-system/domain-module'

@Entity({ tableName: 'rewards' })
export class RewardEntity extends BaseEntity<RewardEntity, 'id'> {
  @PrimaryKey({ type: 'uuid' })
  id!: string

  @Enum({
    items: () => RewardOperationStatus,
    type: 'smallint',
    default: RewardOperationStatus.PENDING,
  })
  status: RewardOperationStatus = RewardOperationStatus.PENDING

  @Property({ type: 'uuid' })
  operationId!: string

  @Property({ type: 'uuid' })
  agentId!: string

  @Property({ type: 'uuid' })
  referrerId!: string

  @Property()
  level!: number

  @Property({ type: 'decimal', precision: 12, scale: 2 })
  amount!: string

  @Property({ type: 'decimal', precision: 12, scale: 2 })
  profit!: string

  @Property()
  percentage!: number

  @Property({ type: 'timestamptz' })
  createdAt!: Date
}

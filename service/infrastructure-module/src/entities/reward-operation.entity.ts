import { Entity }                              from '@mikro-orm/core'
import { Property }                            from '@mikro-orm/core'
import { PrimaryKey }                          from '@mikro-orm/core'
import { Enum }                                from '@mikro-orm/core'
import { Embedded }                            from '@mikro-orm/core'
import { BaseEntity }                          from '@mikro-orm/core'

import { RewardOperationStatus }               from '@rewards-system/domain-module'

import { RewardOperationSourceEmbeddedEntity } from '../embedded-entities/index.js'

@Entity({ tableName: 'reward_operations' })
export class RewardOperationEntity extends BaseEntity<RewardOperationEntity, 'id'> {
  @PrimaryKey({ type: 'uuid' })
  id!: string

  @Property({ type: 'uuid' })
  rewardProgramId!: string

  @Property({ type: 'uuid' })
  referrerId!: string

  @Enum({
    items: () => RewardOperationStatus,
    type: 'smallint',
    default: RewardOperationStatus.PENDING,
  })
  status: RewardOperationStatus = RewardOperationStatus.PENDING

  @Embedded(() => RewardOperationSourceEmbeddedEntity)
  source!: RewardOperationSourceEmbeddedEntity

  @Property({ type: 'decimal', precision: 12, scale: 2 })
  amount!: string

  @Property({ type: 'timestamptz' })
  createdAt!: Date
}

import { Embedded }                        from '@mikro-orm/core'
import { Entity }                          from '@mikro-orm/core'
import { Property }                        from '@mikro-orm/core'
import { PrimaryKey }                      from '@mikro-orm/core'
import { Enum }                            from '@mikro-orm/core'
import { BaseEntity }                      from '@mikro-orm/core'

import { RewardOperationStatus }           from '@rewards-system/domain-module'

import { QuestRewardSourceEmbeddedEntity } from '../embedded-entities/index.js'

@Entity({ tableName: 'quest_rewards' })
export class QuestRewardEntity extends BaseEntity<QuestRewardEntity, 'id'> {
  @PrimaryKey({ type: 'uuid' })
  id!: string

  @Enum({
    items: () => RewardOperationStatus,
    type: 'smallint',
    default: RewardOperationStatus.PENDING,
  })
  status: RewardOperationStatus = RewardOperationStatus.PENDING

  @Property({ type: 'uuid' })
  recipientId!: string

  @Embedded(() => QuestRewardSourceEmbeddedEntity)
  source!: QuestRewardSourceEmbeddedEntity

  @Property({ type: 'decimal', precision: 12, scale: 2 })
  amount!: string

  @Property({ type: 'timestamptz' })
  createdAt!: Date
}

import { Entity }     from '@mikro-orm/core'
import { Property }   from '@mikro-orm/core'
import { PrimaryKey } from '@mikro-orm/core'
import { BaseEntity } from '@mikro-orm/core'

@Entity({ tableName: 'reward_agents' })
export class RewardAgentEntity extends BaseEntity<RewardAgentEntity, 'id'> {
  @PrimaryKey({ type: 'uuid' })
  id!: string

  @Property()
  code!: string

  @Property({ type: 'uuid', nullable: true })
  parentId?: string

  @Property({
    type: 'ltree',
    nullable: true,
  })
  path?: string

  @Property({ type: 'jsonb', default: '{}' })
  metadata!: Record<string, any>
}

import { Entity }     from '@mikro-orm/core'
import { Property }   from '@mikro-orm/core'
import { PrimaryKey } from '@mikro-orm/core'
import { BaseEntity } from '@mikro-orm/core'

@Entity({ tableName: 'referral_agents' })
export class ReferralAgentEntity extends BaseEntity<ReferralAgentEntity, 'id'> {
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

import { Entity }                  from '@mikro-orm/core'
import { BaseEntity }              from '@mikro-orm/core'
import { Property }                from '@mikro-orm/core'
import { PrimaryKey }              from '@mikro-orm/core'
import { OneToMany }               from '@mikro-orm/core'
import { Cascade }                 from '@mikro-orm/core'
import { Collection }              from '@mikro-orm/core'
import { Unique }                  from '@mikro-orm/core'

import { RewardProgramRuleEntity } from './reward-program-rule.entity.js'

@Entity({ tableName: 'reward_programs' })
export class RewardProgramEntity extends BaseEntity<RewardProgramEntity, 'id'> {
  @PrimaryKey({ type: 'uuid' })
  id!: string

  @Property()
  @Unique()
  code!: string

  @Property()
  name!: string

  @Property()
  percentage!: number

  @OneToMany({
    entity: () => RewardProgramRuleEntity,
    mappedBy: 'program',
    cascade: [Cascade.ALL],
    orphanRemoval: true,
    eager: true,
  })
  rules = new Collection<RewardProgramRuleEntity>(this)
}

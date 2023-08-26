import { Entity }                    from '@mikro-orm/core'
import { BaseEntity }                from '@mikro-orm/core'
import { Property }                  from '@mikro-orm/core'
import { PrimaryKey }                from '@mikro-orm/core'
import { OneToMany }                 from '@mikro-orm/core'
import { Cascade }                   from '@mikro-orm/core'
import { Collection }                from '@mikro-orm/core'

import { ReferralProgramRuleEntity } from './referral-program-rule.entity.js'

@Entity({ tableName: 'referral_programs' })
export class ReferralProgramEntity extends BaseEntity<ReferralProgramEntity, 'id'> {
  @PrimaryKey({ type: 'uuid' })
  id!: string

  @Property()
  code!: string

  @Property()
  name!: string

  @Property()
  percentage!: number

  @OneToMany({
    entity: () => ReferralProgramRuleEntity,
    mappedBy: 'program',
    cascade: [Cascade.ALL],
    orphanRemoval: true,
    eager: true,
  })
  rules = new Collection<ReferralProgramRuleEntity>(this)
}

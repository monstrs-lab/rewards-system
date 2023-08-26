// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { TopLevelCondition } from '@referral-programs/domain-module'

import { Entity }                 from '@mikro-orm/core'
import { PrimaryKey }             from '@mikro-orm/core'
import { ManyToOne }              from '@mikro-orm/core'
import { BaseEntity }             from '@mikro-orm/core'
import { Property }               from '@mikro-orm/core'

import { ReferralProgramEntity }  from './referral-program.entity.js'

@Entity({ tableName: 'referral_program_rules' })
export class ReferralProgramRuleEntity extends BaseEntity<ReferralProgramRuleEntity, 'id'> {
  @PrimaryKey({ type: 'uuid' })
  id!: string

  @Property()
  name!: string

  @Property({ type: 'int' })
  order!: number

  @Property({ type: 'jsonb', default: '{}' })
  conditions!: TopLevelCondition

  @Property({ type: 'jsonb', default: '{}' })
  fields!: Array<{
    conditions: TopLevelCondition
    percentage: number
  }>

  @ManyToOne(() => ReferralProgramEntity)
  program!: ReferralProgramEntity
}

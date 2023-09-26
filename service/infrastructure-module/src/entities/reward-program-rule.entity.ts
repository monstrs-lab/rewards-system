// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { TopLevelCondition } from '@rewards-system/domain-module'

import { Entity }                 from '@mikro-orm/core'
import { PrimaryKey }             from '@mikro-orm/core'
import { ManyToOne }              from '@mikro-orm/core'
import { BaseEntity }             from '@mikro-orm/core'
import { Property }               from '@mikro-orm/core'

import { RewardProgramEntity }    from './reward-program.entity.js'

@Entity({ tableName: 'reward_program_rules' })
export class RewardProgramRuleEntity extends BaseEntity<RewardProgramRuleEntity, 'id'> {
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

  @ManyToOne(() => RewardProgramEntity)
  program!: RewardProgramEntity
}

import { Entity }     from '@mikro-orm/core'
import { Property }   from '@mikro-orm/core'
import { PrimaryKey } from '@mikro-orm/core'
import { BaseEntity } from '@mikro-orm/core'

@Entity({ tableName: 'reward_points_balances' })
export class RewardPointsBalanceEntity extends BaseEntity<RewardPointsBalanceEntity, 'id'> {
  @PrimaryKey({ type: 'uuid' })
  id!: string

  @Property({ type: 'decimal', precision: 12, scale: 2 })
  amount!: number
}

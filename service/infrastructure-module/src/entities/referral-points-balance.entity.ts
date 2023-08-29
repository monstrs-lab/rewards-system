import { Entity }     from '@mikro-orm/core'
import { Property }   from '@mikro-orm/core'
import { PrimaryKey } from '@mikro-orm/core'
import { BaseEntity } from '@mikro-orm/core'

@Entity({ tableName: 'referral_points_balances' })
export class ReferralPointsBalanceEntity extends BaseEntity<ReferralPointsBalanceEntity, 'id'> {
  @PrimaryKey({ type: 'uuid' })
  id!: string

  @Property({ type: 'decimal', precision: 12, scale: 2 })
  amount!: number
}

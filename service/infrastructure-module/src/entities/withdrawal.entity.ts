import { Entity }     from '@mikro-orm/core'
import { Property }   from '@mikro-orm/core'
import { PrimaryKey } from '@mikro-orm/core'
import { BaseEntity } from '@mikro-orm/core'

@Entity({ tableName: 'withdrawals' })
export class WithdrawalEntity extends BaseEntity<WithdrawalEntity, 'id'> {
  @PrimaryKey({ type: 'uuid' })
  id!: string

  @Property({ type: 'uuid' })
  ownerId!: string

  @Property({ type: 'decimal', precision: 12, scale: 2 })
  amount!: string

  @Property({ type: 'timestamptz' })
  createdAt!: Date
}

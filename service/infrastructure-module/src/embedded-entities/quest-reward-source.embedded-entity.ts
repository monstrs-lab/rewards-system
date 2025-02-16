import { Embeddable } from '@mikro-orm/core'
import { Property }   from '@mikro-orm/core'

@Embeddable()
export class QuestRewardSourceEmbeddedEntity {
  @Property({ type: 'uuid' })
  id!: string

  @Property()
  type!: string
}

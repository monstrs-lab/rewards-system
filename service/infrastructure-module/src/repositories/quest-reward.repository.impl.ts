import type { RecordMetadata }                      from '@monstrs/nestjs-cqrs-kafka-events'
import type { IEvent }                              from '@nestjs/cqrs'
import type { QuestReward }                         from '@rewards-system/domain-module'
import type { QuestRewardSource }                   from '@rewards-system/domain-module'
import type { FindQuestRewardsByQueryResult }       from '@rewards-system/domain-module'
import type { FindQuestRewardsByQuery }             from '@rewards-system/domain-module'

import { EntityRepository }                         from '@mikro-orm/core'
import { EntityManager }                            from '@mikro-orm/core'
import { InjectRepository }                         from '@mikro-orm/nestjs'
import { EntityManager as PostgreSqlEntityManager } from '@mikro-orm/postgresql'
import { MikroORMQueryBuilder }                     from '@monstrs/mikro-orm-query-builder'
import { Injectable }                               from '@nestjs/common'
import { Inject }                                   from '@nestjs/common'
import { EventBus }                                 from '@nestjs/cqrs'

import { QuestRewardRepository }                    from '@rewards-system/domain-module'

import { QuestRewardEntity }                        from '../entities/index.js'
import { QuestRewardMapper }                        from '../mappers/index.js'

@Injectable()
export class QuestRewardRepositoryImpl extends QuestRewardRepository {
  constructor(
    @InjectRepository(QuestRewardEntity)
    private readonly repository: EntityRepository<QuestRewardEntity>,
    @Inject(EntityManager)
    private readonly em: PostgreSqlEntityManager,
    private readonly mapper: QuestRewardMapper,
    private readonly eventBus: EventBus
  ) {
    super()
  }

  async save(aggregate: QuestReward): Promise<void> {
    const entity = await this.repository.findOne(aggregate.id)

    const em = this.em.fork()

    await em.begin()

    try {
      em.persist(this.mapper.toPersistence(aggregate, entity || new QuestRewardEntity()))

      if (aggregate.getUncommittedEvents().length > 0) {
        await this.eventBus.publishAll<IEvent, Promise<Array<RecordMetadata>>>(
          aggregate.getUncommittedEvents()
        )
      }

      aggregate.commit()

      await em.commit()
    } catch (error) {
      await em.rollback()

      throw error
    }
  }

  async findById(id: string): Promise<QuestReward | undefined> {
    const entity = await this.repository.findOne({
      id,
    })

    return entity ? this.mapper.toDomain(entity) : undefined
  }

  async findByRecipinetAndSource(
    recipientId: string,
    source: QuestRewardSource
  ): Promise<QuestReward | undefined> {
    const entity = await this.repository.findOne({
      recipientId,
      source: {
        id: source.id,
        type: source.type,
      },
    })

    return entity ? this.mapper.toDomain(entity) : undefined
  }

  async findByQuery({
    pager,
    order,
    query,
  }: FindQuestRewardsByQuery): Promise<FindQuestRewardsByQueryResult> {
    const [rewards, hasNextPage] = await new MikroORMQueryBuilder<QuestRewardEntity>(
      this.em.createQueryBuilder(QuestRewardEntity)
    )
      .id('id', query?.id)
      .id('recipientId', query?.recipientId)
      .order(order)
      .pager(pager)
      .execute()

    return {
      rewards: rewards.map((reward) => this.mapper.toDomain(reward)),
      hasNextPage,
    }
  }
}

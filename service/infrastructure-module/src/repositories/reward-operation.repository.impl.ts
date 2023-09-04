import type { RewardOperation }                     from '@rewards-system/domain-module'
import type { FindRewardOperationsByQueryResult }   from '@rewards-system/domain-module'
import type { FindRewardOperationsByQuery }         from '@rewards-system/domain-module'
import type { RecordMetadata }                      from '@monstrs/nestjs-cqrs-kafka-events'
import type { IEvent }                              from '@nestjs/cqrs'

import { Injectable }                               from '@nestjs/common'
import { Inject }                                   from '@nestjs/common'
import { EventBus }                                 from '@nestjs/cqrs'
import { MikroORMQueryBuilder }                     from '@monstrs/mikro-orm-query-builder'
import { InjectRepository }                         from '@mikro-orm/nestjs'
import { EntityRepository }                         from '@mikro-orm/core'
import { EntityManager as PostgreSqlEntityManager } from '@mikro-orm/postgresql'
import { EntityManager }                            from '@mikro-orm/core'

import { RewardOperationRepository }                from '@rewards-system/domain-module'

import { RewardOperationEntity }                    from '../entities/index.js'
import { RewardOperationMapper }                    from '../mappers/index.js'

@Injectable()
export class RewardOperationRepositoryImpl extends RewardOperationRepository {
  constructor(
    @InjectRepository(RewardOperationEntity)
    private readonly repository: EntityRepository<RewardOperationEntity>,
    @Inject(EntityManager)
    private readonly em: PostgreSqlEntityManager,
    private readonly mapper: RewardOperationMapper,
    private readonly eventBus: EventBus
  ) {
    super()
  }

  async save(aggregate: RewardOperation): Promise<void> {
    const entity = await this.repository.findOne(aggregate.id)

    const em = this.em.fork()

    await em.begin()

    try {
      em.persist(this.mapper.toPersistence(aggregate, entity || new RewardOperationEntity()))

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

  async findById(id: string): Promise<RewardOperation | undefined> {
    const entity = await this.repository.findOne({
      id,
    })

    return entity ? this.mapper.toDomain(entity) : undefined
  }

  async findByQuery({
    pager,
    order,
    query,
  }: FindRewardOperationsByQuery): Promise<FindRewardOperationsByQueryResult> {
    const [rewardOperations, hasNextPage] = await new MikroORMQueryBuilder<RewardOperationEntity>(
      this.em.createQueryBuilder(RewardOperationEntity)
    )
      .id('id', query?.id)
      .order(order)
      .pager(pager)
      .execute()

    return {
      rewardOperations: rewardOperations.map((rewardOperation) =>
        this.mapper.toDomain(rewardOperation)),
      hasNextPage,
    }
  }
}

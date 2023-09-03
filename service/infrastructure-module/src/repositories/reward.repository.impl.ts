import type { Reward }                              from '@rewards-system/domain-module'
import type { FindRewardsByQueryResult }            from '@rewards-system/domain-module'
import type { FindRewardsByQuery }                  from '@rewards-system/domain-module'
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

import { RewardRepository }                         from '@rewards-system/domain-module'

import { RewardEntity }                             from '../entities/index.js'
import { RewardMapper }                             from '../mappers/index.js'

@Injectable()
export class RewardRepositoryImpl extends RewardRepository {
  constructor(
    @InjectRepository(RewardEntity)
    private readonly repository: EntityRepository<RewardEntity>,
    @Inject(EntityManager)
    private readonly em: PostgreSqlEntityManager,
    private readonly mapper: RewardMapper,
    private readonly eventBus: EventBus
  ) {
    super()
  }

  async save(aggregate: Reward): Promise<void> {
    const exists = (await this.repository.findOne(aggregate.id)) || new RewardEntity()

    const em = this.em.fork()

    await em.begin()

    try {
      em.persist(this.mapper.toPersistence(aggregate, exists))

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

  async findById(id: string): Promise<Reward | undefined> {
    const entity = await this.repository.findOne({
      id,
    })

    return entity ? this.mapper.toDomain(entity) : undefined
  }

  override async findByOperationId(operationId: string): Promise<Array<Reward>> {
    const entities = await this.repository.find({
      operationId,
    })

    return entities.map((entity) => this.mapper.toDomain(entity))
  }

  async findByQuery({
    pager,
    order,
    query,
  }: FindRewardsByQuery): Promise<FindRewardsByQueryResult> {
    const [rewards, hasNextPage] = await new MikroORMQueryBuilder<RewardEntity>(
      this.em.createQueryBuilder(RewardEntity)
    )
      .id('id', query?.id)
      .id('agentId', query?.agentId)
      .id('operationId', query?.operationId)
      .order(order)
      .pager(pager)
      .execute()

    return {
      rewards: rewards.map((reward) => this.mapper.toDomain(reward)),
      hasNextPage,
    }
  }
}

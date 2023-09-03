import type { RewardAgent }                         from '@rewards-system/domain-module'
import type { FindRewardAgentsByQueryResult }       from '@rewards-system/domain-module'
import type { FindRewardAgentsByQuery }             from '@rewards-system/domain-module'
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

import { RewardAgentRepository }                    from '@rewards-system/domain-module'

import { RewardAgentEntity }                        from '../entities/index.js'
import { RewardAgentMapper }                        from '../mappers/index.js'

@Injectable()
export class RewardAgentRepositoryImpl extends RewardAgentRepository {
  constructor(
    @InjectRepository(RewardAgentEntity)
    private readonly repository: EntityRepository<RewardAgentEntity>,
    @Inject(EntityManager)
    private readonly em: PostgreSqlEntityManager,
    private readonly mapper: RewardAgentMapper,
    private readonly eventBus: EventBus
  ) {
    super()
  }

  async save(aggregate: RewardAgent): Promise<void> {
    const exists = await this.repository.findOne(aggregate.id)
    const entity = this.mapper.toPersistence(aggregate, exists || new RewardAgentEntity())

    if (!exists) {
      const parent = aggregate.parentId ? await this.repository.findOne(aggregate.parentId) : null

      entity.path = parent ? [parent.path, aggregate.code].join('.') : aggregate.code
    }

    const em = this.em.fork()

    await em.begin()

    try {
      await em.persist(entity)

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

  async findById(id: string): Promise<RewardAgent | undefined> {
    const entity = await this.repository.findOne({
      id,
    })

    return entity ? this.mapper.toDomain(entity) : undefined
  }

  async findByCode(code: string): Promise<RewardAgent | undefined> {
    const entity = await this.repository.findOne({
      code,
    })

    return entity ? this.mapper.toDomain(entity) : undefined
  }

  async findDescendents(agent: RewardAgent): Promise<Array<RewardAgent>> {
    const entity = await this.repository.findOne(agent.id)

    if (!entity) {
      return []
    }

    const rewardAgents = await this.em
      .createQueryBuilder(RewardAgentEntity, 'agent')
      .where('agent.path <@ ? and agent.path <> ?', [entity.path, entity.path])
      .getResult()

    return rewardAgents.map((rewardAgent) => this.mapper.toDomain(rewardAgent))
  }

  async findAncestors(agent: RewardAgent): Promise<Array<RewardAgent>> {
    const entity = await this.repository.findOne(agent.id)

    if (!entity) {
      return []
    }

    const rewardAgents = await this.em
      .createQueryBuilder(RewardAgentEntity, 'agent')
      .where('agent.path @> ? and agent.path <> ?', [entity.path, entity.path])
      .getResult()

    return rewardAgents.map((rewardAgent) => this.mapper.toDomain(rewardAgent))
  }

  async findByQuery({
    pager,
    order,
    query,
  }: FindRewardAgentsByQuery): Promise<FindRewardAgentsByQueryResult> {
    const [rewardAgents, hasNextPage] = await new MikroORMQueryBuilder<RewardAgentEntity>(
      this.em.createQueryBuilder(RewardAgentEntity)
    )
      .id('id', query?.id)
      .order(order)
      .pager(pager)
      .execute()

    return {
      rewardAgents: rewardAgents.map((rewardAgent) => this.mapper.toDomain(rewardAgent)),
      hasNextPage,
    }
  }
}

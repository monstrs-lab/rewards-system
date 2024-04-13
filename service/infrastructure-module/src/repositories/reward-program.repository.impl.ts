import type { RecordMetadata }                      from '@monstrs/nestjs-cqrs-kafka-events'
import type { IEvent }                              from '@nestjs/cqrs'
import type { RewardProgram }                       from '@rewards-system/domain-module'
import type { FindRewardProgramsByQueryResult }     from '@rewards-system/domain-module'
import type { FindRewardProgramsByQuery }           from '@rewards-system/domain-module'

import { EntityRepository }                         from '@mikro-orm/core'
import { EntityManager }                            from '@mikro-orm/core'
import { InjectRepository }                         from '@mikro-orm/nestjs'
import { EntityManager as PostgreSqlEntityManager } from '@mikro-orm/postgresql'
import { MikroORMQueryBuilder }                     from '@monstrs/mikro-orm-query-builder'
import { Injectable }                               from '@nestjs/common'
import { Inject }                                   from '@nestjs/common'
import { EventBus }                                 from '@nestjs/cqrs'

import { RewardProgramRepository }                  from '@rewards-system/domain-module'

import { RewardProgramEntity }                      from '../entities/index.js'
import { RewardProgramMapper }                      from '../mappers/index.js'

@Injectable()
export class RewardProgramRepositoryImpl extends RewardProgramRepository {
  constructor(
    @InjectRepository(RewardProgramEntity)
    private readonly repository: EntityRepository<RewardProgramEntity>,
    @Inject(EntityManager)
    private readonly em: PostgreSqlEntityManager,
    private readonly mapper: RewardProgramMapper,
    private readonly eventBus: EventBus
  ) {
    super()
  }

  async save(aggregate: RewardProgram): Promise<void> {
    const entity = await this.repository.findOne(aggregate.id)

    const em = this.em.fork()

    await em.begin()

    try {
      em.persist(this.mapper.toPersistence(aggregate, entity || new RewardProgramEntity()))

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

  async findById(id: string): Promise<RewardProgram | undefined> {
    const entity = await this.repository.findOne({
      id,
    })

    return entity ? this.mapper.toDomain(entity) : undefined
  }

  async findByCode(code: string): Promise<RewardProgram | undefined> {
    const entity = await this.repository.findOne({
      code,
    })

    return entity ? this.mapper.toDomain(entity) : undefined
  }

  async findByQuery({
    pager,
    order,
    query,
  }: FindRewardProgramsByQuery): Promise<FindRewardProgramsByQueryResult> {
    const [rewardPrograms, hasNextPage] = await new MikroORMQueryBuilder<RewardProgramEntity>(
      this.em.createQueryBuilder(RewardProgramEntity).leftJoinAndSelect('rules', 'rules')
    )
      .id('id', query?.id)
      .order(order)
      .pager(pager)
      .execute()

    return {
      rewardPrograms: rewardPrograms.map((rewardProgram) => this.mapper.toDomain(rewardProgram)),
      hasNextPage,
    }
  }
}

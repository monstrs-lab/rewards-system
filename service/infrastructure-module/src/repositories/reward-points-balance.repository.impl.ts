import type { RewardPointsBalance }                   from '@rewards-system/domain-module'
import type { FindRewardPointsBalancesByQueryResult } from '@rewards-system/domain-module'
import type { FindRewardPointsBalancesByQuery }       from '@rewards-system/domain-module'
import type { RecordMetadata }                        from '@monstrs/nestjs-cqrs-kafka-events'
import type { IEvent }                                from '@nestjs/cqrs'

import { Injectable }                                 from '@nestjs/common'
import { Inject }                                     from '@nestjs/common'
import { EventBus }                                   from '@nestjs/cqrs'
import { MikroORMQueryBuilder }                       from '@monstrs/mikro-orm-query-builder'
import { InjectRepository }                           from '@mikro-orm/nestjs'
import { EntityRepository }                           from '@mikro-orm/core'
import { EntityManager as PostgreSqlEntityManager }   from '@mikro-orm/postgresql'
import { EntityManager }                              from '@mikro-orm/core'

import { RewardPointsBalanceRepository }              from '@rewards-system/domain-module'

import { RewardPointsBalanceEntity }                  from '../entities/index.js'
import { RewardPointsBalanceMapper }                  from '../mappers/index.js'

@Injectable()
export class RewardPointsBalanceRepositoryImpl extends RewardPointsBalanceRepository {
  constructor(
    @InjectRepository(RewardPointsBalanceEntity)
    private readonly repository: EntityRepository<RewardPointsBalanceEntity>,
    @Inject(EntityManager)
    private readonly em: PostgreSqlEntityManager,
    private readonly mapper: RewardPointsBalanceMapper,
    private readonly eventBus: EventBus
  ) {
    super()
  }

  async save(aggregate: RewardPointsBalance): Promise<void> {
    const exists = (await this.repository.findOne(aggregate.id)) || new RewardPointsBalanceEntity()

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

  async findById(id: string): Promise<RewardPointsBalance | undefined> {
    const entity = await this.repository.findOne({
      id,
    })

    return entity ? this.mapper.toDomain(entity) : undefined
  }

  async findByQuery({
    pager,
    order,
    query,
  }: FindRewardPointsBalancesByQuery): Promise<FindRewardPointsBalancesByQueryResult> {
    const [rewardPointsBalances, hasNextPage] =
      await new MikroORMQueryBuilder<RewardPointsBalanceEntity>(
        this.em.createQueryBuilder(RewardPointsBalanceEntity)
      )
        .id('id', query?.id)
        .order(order)
        .pager(pager)
        .execute()

    return {
      rewardPointsBalances: rewardPointsBalances.map((rewardPointsBalance) =>
        this.mapper.toDomain(rewardPointsBalance)),
      hasNextPage,
    }
  }
}

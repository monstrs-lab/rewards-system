import type { RecordMetadata }                      from '@monstrs/nestjs-cqrs-kafka-events'
import type { IEvent }                              from '@nestjs/cqrs'
import type { Withdrawal }                          from '@rewards-system/domain-module'
import type { FindWithdrawalsByQueryResult }        from '@rewards-system/domain-module'
import type { FindWithdrawalsByQuery }              from '@rewards-system/domain-module'

import { EntityRepository }                         from '@mikro-orm/core'
import { EntityManager }                            from '@mikro-orm/core'
import { InjectRepository }                         from '@mikro-orm/nestjs'
import { EntityManager as PostgreSqlEntityManager } from '@mikro-orm/postgresql'
import { MikroORMQueryBuilder }                     from '@monstrs/mikro-orm-query-builder'
import { Injectable }                               from '@nestjs/common'
import { Inject }                                   from '@nestjs/common'
import { EventBus }                                 from '@nestjs/cqrs'

import { WithdrawalRepository }                     from '@rewards-system/domain-module'

import { WithdrawalEntity }                         from '../entities/index.js'
import { WithdrawalMapper }                         from '../mappers/index.js'

@Injectable()
export class WithdrawalRepositoryImpl extends WithdrawalRepository {
  constructor(
    @InjectRepository(WithdrawalEntity)
    private readonly repository: EntityRepository<WithdrawalEntity>,
    @Inject(EntityManager)
    private readonly em: PostgreSqlEntityManager,
    private readonly mapper: WithdrawalMapper,
    private readonly eventBus: EventBus
  ) {
    super()
  }

  async save(aggregate: Withdrawal): Promise<void> {
    const entity = await this.repository.findOne(aggregate.id)

    const em = this.em.fork()

    await em.begin()

    try {
      em.persist(this.mapper.toPersistence(aggregate, entity || new WithdrawalEntity()))

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

  async findById(id: string): Promise<Withdrawal | undefined> {
    const entity = await this.repository.findOne({
      id,
    })

    return entity ? this.mapper.toDomain(entity) : undefined
  }

  async findByQuery({
    pager,
    order,
    query,
  }: FindWithdrawalsByQuery): Promise<FindWithdrawalsByQueryResult> {
    const [withdrawals, hasNextPage] = await new MikroORMQueryBuilder<WithdrawalEntity>(
      this.em.createQueryBuilder(WithdrawalEntity)
    )
      .id('id', query?.id)
      .id('ownerId', query?.ownerId)
      .order(order)
      .pager(pager)
      .execute()

    return {
      withdrawals: withdrawals.map((withdrawal) => this.mapper.toDomain(withdrawal)),
      hasNextPage,
    }
  }
}

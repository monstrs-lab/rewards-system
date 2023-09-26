import type { RecordMetadata }                              from '@monstrs/nestjs-cqrs-kafka-events'
import type { IEvent }                                      from '@nestjs/cqrs'
import type { RewardPointsJournalEntry }                    from '@rewards-system/domain-module'
import type { FindRewardPointsJournalEntriesByQueryResult } from '@rewards-system/domain-module'
import type { FindRewardPointsJournalEntriesByQuery }       from '@rewards-system/domain-module'

import { EntityRepository }                                 from '@mikro-orm/core'
import { EntityManager }                                    from '@mikro-orm/core'
import { InjectRepository }                                 from '@mikro-orm/nestjs'
import { EntityManager as PostgreSqlEntityManager }         from '@mikro-orm/postgresql'
import { MikroORMQueryBuilder }                             from '@monstrs/mikro-orm-query-builder'
import { Injectable }                                       from '@nestjs/common'
import { Inject }                                           from '@nestjs/common'
import { EventBus }                                         from '@nestjs/cqrs'
import { BigNumber }                                        from 'bignumber.js'

import { RewardPointsJournalEntryRepository }               from '@rewards-system/domain-module'

import { RewardPointsJournalEntryEntity }                   from '../entities/index.js'
import { RewardPointsTransactionEntity }                    from '../entities/index.js'
import { RewardPointsJournalEntryMapper }                   from '../mappers/index.js'

@Injectable()
export class RewardPointsJournalEntryRepositoryImpl extends RewardPointsJournalEntryRepository {
  constructor(
    @InjectRepository(RewardPointsJournalEntryEntity)
    private readonly repository: EntityRepository<RewardPointsJournalEntryEntity>,
    @Inject(EntityManager)
    private readonly em: PostgreSqlEntityManager,
    private readonly mapper: RewardPointsJournalEntryMapper,
    private readonly eventBus: EventBus
  ) {
    super()
  }

  async save(aggregate: RewardPointsJournalEntry): Promise<void> {
    const entity = await this.repository.findOne(aggregate.id)

    const em = this.em.fork()

    await em.begin()

    try {
      em.persist(
        this.mapper.toPersistence(aggregate, entity || new RewardPointsJournalEntryEntity())
      )

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

  async findById(id: string): Promise<RewardPointsJournalEntry | undefined> {
    const entity = await this.repository.findOne({
      id,
    })

    return entity ? this.mapper.toDomain(entity) : undefined
  }

  async findByQuery({
    pager,
    order,
    query,
  }: FindRewardPointsJournalEntriesByQuery): Promise<FindRewardPointsJournalEntriesByQueryResult> {
    const [rewardPointsJournalEntries, hasNextPage] =
      await new MikroORMQueryBuilder<RewardPointsJournalEntryEntity>(
        this.em.createQueryBuilder(RewardPointsJournalEntryEntity)
      )
        .id('id', query?.id)
        .order(order)
        .pager(pager)
        .execute()

    return {
      rewardPointsJournalEntries: rewardPointsJournalEntries.map((rewardPointsJournalEntry) =>
        this.mapper.toDomain(rewardPointsJournalEntry)),
      hasNextPage,
    }
  }

  override async calculateBookAccountBalance(bookId: string, account: string): Promise<number> {
    const result = await this.em
      .createQueryBuilder(RewardPointsTransactionEntity, 'transaction')
      .where({ 'transaction.bookId': bookId, 'transaction.account': account })
      .select('sum(transaction.credit) as credit, sum(transaction.debit) as debit')
      .groupBy(['transaction.book_id', 'transaction.account'])
      .execute('get', false)

    if (!result) {
      return 0
    }

    return new BigNumber(result.credit).minus(new BigNumber(result.debit)).toNumber()
  }
}

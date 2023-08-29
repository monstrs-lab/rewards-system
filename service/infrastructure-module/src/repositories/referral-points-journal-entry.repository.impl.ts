import type { ReferralPointsJournalEntry }                    from '@referral-programs/domain-module'
import type { FindReferralPointsJournalEntriesByQueryResult } from '@referral-programs/domain-module'
import type { FindReferralPointsJournalEntriesByQuery }       from '@referral-programs/domain-module'

import { Injectable }                                         from '@nestjs/common'
import { Inject }                                             from '@nestjs/common'
import { EventBus }                                           from '@nestjs/cqrs'
import { MikroORMQueryBuilder }                               from '@monstrs/mikro-orm-query-builder'
import { InjectRepository }                                   from '@mikro-orm/nestjs'
import { EntityRepository }                                   from '@mikro-orm/core'
import { EntityManager as PostgreSqlEntityManager }           from '@mikro-orm/postgresql'
import { EntityManager }                                      from '@mikro-orm/core'

import { ReferralPointsJournalEntryRepository }               from '@referral-programs/domain-module'

import { ReferralPointsJournalEntryEntity }                   from '../entities/index.js'
import { ReferralPointsTransactionEntity }                    from '../entities/index.js'
import { ReferralPointsJournalEntryMapper }                   from '../mappers/index.js'

@Injectable()
export class ReferralPointsJournalEntryRepositoryImpl extends ReferralPointsJournalEntryRepository {
  constructor(
    @InjectRepository(ReferralPointsJournalEntryEntity)
    private readonly repository: EntityRepository<ReferralPointsJournalEntryEntity>,
    @Inject(EntityManager)
    private readonly em: PostgreSqlEntityManager,
    private readonly mapper: ReferralPointsJournalEntryMapper,
    private readonly eventBus: EventBus
  ) {
    super()
  }

  async save(aggregate: ReferralPointsJournalEntry): Promise<void> {
    const exists =
      (await this.repository.findOne(aggregate.id)) || new ReferralPointsJournalEntryEntity()

    await this.em.persist(this.mapper.toPersistence(aggregate, exists)).flush()

    if (aggregate.getUncommittedEvents().length > 0) {
      this.eventBus.publishAll(aggregate.getUncommittedEvents())
    }

    aggregate.commit()
  }

  async findById(id: string): Promise<ReferralPointsJournalEntry | undefined> {
    const entity = await this.repository.findOne({
      id,
    })

    return entity ? this.mapper.toDomain(entity) : undefined
  }

  async findByQuery({
    pager,
    order,
    query,
  }: FindReferralPointsJournalEntriesByQuery): Promise<FindReferralPointsJournalEntriesByQueryResult> {
    const [referralPointsJournalEntries, hasNextPage] =
      await new MikroORMQueryBuilder<ReferralPointsJournalEntryEntity>(
        this.em.createQueryBuilder(ReferralPointsJournalEntryEntity)
      )
        .id('id', query?.id)
        .order(order)
        .pager(pager)
        .execute()

    return {
      referralPointsJournalEntries: referralPointsJournalEntries.map((referralPointsJournalEntry) =>
        this.mapper.toDomain(referralPointsJournalEntry)),
      hasNextPage,
    }
  }

  override async calculateBookAccountBalance(bookId: string, account: string): Promise<number> {
    const result = await this.em
      .createQueryBuilder(ReferralPointsTransactionEntity, 'transaction')
      .where({ 'transaction.bookId': bookId, 'transaction.account': account })
      .select('sum(transaction.credit) as credit, sum(transaction.debit) as debit')
      .groupBy(['transaction.book_id', 'transaction.account'])
      .execute('get', false)

    return result.credit - result.debit
  }
}

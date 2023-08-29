import type { ReferralPointsBalance }                   from '@referral-programs/domain-module'
import type { FindReferralPointsBalancesByQueryResult } from '@referral-programs/domain-module'
import type { FindReferralPointsBalancesByQuery }       from '@referral-programs/domain-module'

import { Injectable }                                   from '@nestjs/common'
import { Inject }                                       from '@nestjs/common'
import { EventBus }                                     from '@nestjs/cqrs'
import { MikroORMQueryBuilder }                         from '@monstrs/mikro-orm-query-builder'
import { InjectRepository }                             from '@mikro-orm/nestjs'
import { EntityRepository }                             from '@mikro-orm/core'
import { EntityManager as PostgreSqlEntityManager }     from '@mikro-orm/postgresql'
import { EntityManager }                                from '@mikro-orm/core'

import { ReferralPointsBalanceRepository }              from '@referral-programs/domain-module'

import { ReferralPointsBalanceEntity }                  from '../entities/index.js'
import { ReferralPointsBalanceMapper }                  from '../mappers/index.js'

@Injectable()
export class ReferralPointsBalanceRepositoryImpl extends ReferralPointsBalanceRepository {
  constructor(
    @InjectRepository(ReferralPointsBalanceEntity)
    private readonly repository: EntityRepository<ReferralPointsBalanceEntity>,
    @Inject(EntityManager)
    private readonly em: PostgreSqlEntityManager,
    private readonly mapper: ReferralPointsBalanceMapper,
    private readonly eventBus: EventBus
  ) {
    super()
  }

  async save(aggregate: ReferralPointsBalance): Promise<void> {
    const exists =
      (await this.repository.findOne(aggregate.id)) || new ReferralPointsBalanceEntity()

    await this.em.persist(this.mapper.toPersistence(aggregate, exists)).flush()

    if (aggregate.getUncommittedEvents().length > 0) {
      this.eventBus.publishAll(aggregate.getUncommittedEvents())
    }

    aggregate.commit()
  }

  async findById(id: string): Promise<ReferralPointsBalance | undefined> {
    const entity = await this.repository.findOne({
      id,
    })

    return entity ? this.mapper.toDomain(entity) : undefined
  }

  async findByQuery({
    pager,
    order,
    query,
  }: FindReferralPointsBalancesByQuery): Promise<FindReferralPointsBalancesByQueryResult> {
    const [referralPointsBalances, hasNextPage] =
      await new MikroORMQueryBuilder<ReferralPointsBalanceEntity>(
        this.em.createQueryBuilder(ReferralPointsBalanceEntity)
      )
        .id('id', query?.id)
        .order(order)
        .pager(pager)
        .execute()

    return {
      referralPointsBalances: referralPointsBalances.map((referralPointsBalance) =>
        this.mapper.toDomain(referralPointsBalance)),
      hasNextPage,
    }
  }
}

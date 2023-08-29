import type { ReferralOperation }                   from '@referral-programs/domain-module'
import type { FindReferralOperationsByQueryResult } from '@referral-programs/domain-module'
import type { FindReferralOperationsByQuery }       from '@referral-programs/domain-module'

import { Injectable }                               from '@nestjs/common'
import { Inject }                                   from '@nestjs/common'
import { EventBus }                                 from '@nestjs/cqrs'
import { MikroORMQueryBuilder }                     from '@monstrs/mikro-orm-query-builder'
import { InjectRepository }                         from '@mikro-orm/nestjs'
import { EntityRepository }                         from '@mikro-orm/core'
import { EntityManager as PostgreSqlEntityManager } from '@mikro-orm/postgresql'
import { EntityManager }                            from '@mikro-orm/core'

import { ReferralOperationRepository }              from '@referral-programs/domain-module'

import { ReferralOperationEntity }                  from '../entities/index.js'
import { ReferralOperationMapper }                  from '../mappers/index.js'

@Injectable()
export class ReferralOperationRepositoryImpl extends ReferralOperationRepository {
  constructor(
    @InjectRepository(ReferralOperationEntity)
    private readonly repository: EntityRepository<ReferralOperationEntity>,
    @Inject(EntityManager)
    private readonly em: PostgreSqlEntityManager,
    private readonly mapper: ReferralOperationMapper,
    private readonly eventBus: EventBus
  ) {
    super()
  }

  async save(aggregate: ReferralOperation): Promise<void> {
    const exists = (await this.repository.findOne(aggregate.id)) || new ReferralOperationEntity()

    await this.em.persist(this.mapper.toPersistence(aggregate, exists)).flush()

    if (aggregate.getUncommittedEvents().length > 0) {
      this.eventBus.publishAll(aggregate.getUncommittedEvents())
    }

    aggregate.commit()
  }

  async findById(id: string): Promise<ReferralOperation | undefined> {
    const entity = await this.repository.findOne({
      id,
    })

    return entity ? this.mapper.toDomain(entity) : undefined
  }

  async findByQuery({
    pager,
    order,
    query,
  }: FindReferralOperationsByQuery): Promise<FindReferralOperationsByQueryResult> {
    const [referralOperations, hasNextPage] =
      await new MikroORMQueryBuilder<ReferralOperationEntity>(
        this.em.createQueryBuilder(ReferralOperationEntity)
      )
        .id('id', query?.id)
        .order(order)
        .pager(pager)
        .execute()

    return {
      referralOperations: referralOperations.map((referralOperation) =>
        this.mapper.toDomain(referralOperation)),
      hasNextPage,
    }
  }
}

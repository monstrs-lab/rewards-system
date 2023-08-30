import type { ReferralProfit }                      from '@referral-programs/domain-module'
import type { FindReferralProfitsByQueryResult }    from '@referral-programs/domain-module'
import type { FindReferralProfitsByQuery }          from '@referral-programs/domain-module'

import { Injectable }                               from '@nestjs/common'
import { Inject }                                   from '@nestjs/common'
import { EventBus }                                 from '@nestjs/cqrs'
import { MikroORMQueryBuilder }                     from '@monstrs/mikro-orm-query-builder'
import { InjectRepository }                         from '@mikro-orm/nestjs'
import { EntityRepository }                         from '@mikro-orm/core'
import { EntityManager as PostgreSqlEntityManager } from '@mikro-orm/postgresql'
import { EntityManager }                            from '@mikro-orm/core'

import { ReferralProfitRepository }                 from '@referral-programs/domain-module'

import { ReferralProfitEntity }                     from '../entities/index.js'
import { ReferralProfitMapper }                     from '../mappers/index.js'

@Injectable()
export class ReferralProfitRepositoryImpl extends ReferralProfitRepository {
  constructor(
    @InjectRepository(ReferralProfitEntity)
    private readonly repository: EntityRepository<ReferralProfitEntity>,
    @Inject(EntityManager)
    private readonly em: PostgreSqlEntityManager,
    private readonly mapper: ReferralProfitMapper,
    private readonly eventBus: EventBus
  ) {
    super()
  }

  async save(aggregate: ReferralProfit): Promise<void> {
    const exists = (await this.repository.findOne(aggregate.id)) || new ReferralProfitEntity()

    await this.em.persist(this.mapper.toPersistence(aggregate, exists)).flush()

    if (aggregate.getUncommittedEvents().length > 0) {
      this.eventBus.publishAll(aggregate.getUncommittedEvents())
    }

    aggregate.commit()
  }

  async findById(id: string): Promise<ReferralProfit | undefined> {
    const entity = await this.repository.findOne({
      id,
    })

    return entity ? this.mapper.toDomain(entity) : undefined
  }

  override async findByOperationId(operationId: string): Promise<Array<ReferralProfit>> {
    const entities = await this.repository.find({
      operationId,
    })

    return entities.map((entity) => this.mapper.toDomain(entity))
  }

  async findByQuery({
    pager,
    order,
    query,
  }: FindReferralProfitsByQuery): Promise<FindReferralProfitsByQueryResult> {
    const [referralProfits, hasNextPage] = await new MikroORMQueryBuilder<ReferralProfitEntity>(
      this.em.createQueryBuilder(ReferralProfitEntity)
    )
      .id('id', query?.id)
      .id('agentId', query?.agentId)
      .id('operationId', query?.operationId)
      .order(order)
      .pager(pager)
      .execute()

    return {
      referralProfits: referralProfits.map((referralProfit) =>
        this.mapper.toDomain(referralProfit)),
      hasNextPage,
    }
  }
}

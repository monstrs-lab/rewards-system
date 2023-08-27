import type { ReferralProgram }                     from '@referral-programs/domain-module'
import type { FindReferralProgramsByQueryResult }   from '@referral-programs/domain-module'
import type { FindReferralProgramsByQuery }         from '@referral-programs/domain-module'

import { MikroORMQueryBuilder }                     from '@monstrs/mikro-orm-query-builder'
import { Injectable }                               from '@nestjs/common'
import { Inject }                                   from '@nestjs/common'
import { EventBus }                                 from '@nestjs/cqrs'
import { InjectRepository }                         from '@mikro-orm/nestjs'
import { EntityRepository }                         from '@mikro-orm/core'
import { EntityManager as PostgreSqlEntityManager } from '@mikro-orm/postgresql'
import { EntityManager }                            from '@mikro-orm/core'

import { ReferralProgramRepository }                from '@referral-programs/domain-module'

import { ReferralProgramEntity }                    from '../entities/index.js'
import { ReferralProgramMapper }                    from '../mappers/index.js'

@Injectable()
export class ReferralProgramRepositoryImpl extends ReferralProgramRepository {
  constructor(
    @InjectRepository(ReferralProgramEntity)
    private readonly repository: EntityRepository<ReferralProgramEntity>,
    @Inject(EntityManager)
    private readonly em: PostgreSqlEntityManager,
    private readonly mapper: ReferralProgramMapper,
    private readonly eventBus: EventBus
  ) {
    super()
  }

  async save(aggregate: ReferralProgram): Promise<void> {
    const exists = (await this.repository.findOne(aggregate.id)) || new ReferralProgramEntity()

    await this.em.persist(this.mapper.toPersistence(aggregate, exists)).flush()

    if (aggregate.getUncommittedEvents().length > 0) {
      this.eventBus.publishAll(aggregate.getUncommittedEvents())
    }

    aggregate.commit()
  }

  async findById(id: string): Promise<ReferralProgram | undefined> {
    const entity = await this.repository.findOne({
      id,
    })

    return entity ? this.mapper.toDomain(entity) : undefined
  }

  async findByCode(code: string): Promise<ReferralProgram | undefined> {
    const entity = await this.repository.findOne({
      code,
    })

    return entity ? this.mapper.toDomain(entity) : undefined
  }

  async findByQuery({
    pager,
    order,
    query,
  }: FindReferralProgramsByQuery): Promise<FindReferralProgramsByQueryResult> {
    const [referralPrograms, hasNextPage] = await new MikroORMQueryBuilder<ReferralProgramEntity>(
      this.em.createQueryBuilder(ReferralProgramEntity)
    )
      .id('id', query?.id)
      .order(order)
      .pager(pager)
      .execute()

    return {
      referralPrograms: referralPrograms.map((referralProgram) =>
        this.mapper.toDomain(referralProgram)),
      hasNextPage,
    }
  }
}

import type { ReferralAgent }                       from '@referral-programs/domain-module'
import type { FindReferralAgentsByQueryResult }     from '@referral-programs/domain-module'
import type { FindReferralAgentsByQuery }           from '@referral-programs/domain-module'

import { Injectable }                               from '@nestjs/common'
import { Inject }                                   from '@nestjs/common'
import { EventBus }                                 from '@nestjs/cqrs'
import { MikroORMQueryBuilder }                     from '@monstrs/mikro-orm-query-builder'
import { InjectRepository }                         from '@mikro-orm/nestjs'
import { EntityRepository }                         from '@mikro-orm/core'
import { EntityManager as PostgreSqlEntityManager } from '@mikro-orm/postgresql'
import { EntityManager }                            from '@mikro-orm/core'

import { ReferralAgentRepository }                  from '@referral-programs/domain-module'

import { ReferralAgentEntity }                      from '../entities/index.js'
import { ReferralAgentMapper }                      from '../mappers/index.js'

@Injectable()
export class ReferralAgentRepositoryImpl extends ReferralAgentRepository {
  constructor(
    @InjectRepository(ReferralAgentEntity)
    private readonly repository: EntityRepository<ReferralAgentEntity>,
    @Inject(EntityManager)
    private readonly em: PostgreSqlEntityManager,
    private readonly mapper: ReferralAgentMapper,
    private readonly eventBus: EventBus
  ) {
    super()
  }

  async save(aggregate: ReferralAgent): Promise<void> {
    const exists = await this.repository.findOne(aggregate.id)
    const entity = this.mapper.toPersistence(aggregate, exists || new ReferralAgentEntity())

    if (!exists) {
      const parent = aggregate.parentId ? await this.repository.findOne(aggregate.parentId) : null

      entity.path = parent ? [parent.path, aggregate.code].join('.') : aggregate.code
    }

    await this.em.persist(entity).flush()

    if (aggregate.getUncommittedEvents().length > 0) {
      this.eventBus.publishAll(aggregate.getUncommittedEvents())
    }

    aggregate.commit()
  }

  async findById(id: string): Promise<ReferralAgent | undefined> {
    const entity = await this.repository.findOne({
      id,
    })

    return entity ? this.mapper.toDomain(entity) : undefined
  }

  async findByCode(code: string): Promise<ReferralAgent | undefined> {
    const entity = await this.repository.findOne({
      code,
    })

    return entity ? this.mapper.toDomain(entity) : undefined
  }

  async findDescendents(agent: ReferralAgent): Promise<Array<ReferralAgent>> {
    const entity = await this.repository.findOne(agent.id)

    if (!entity) {
      return []
    }

    const referralAgents = await this.em
      .createQueryBuilder(ReferralAgentEntity, 'agent')
      .where('agent.path <@ ? and agent.path <> ?', [entity.path, entity.path])
      .getResult()

    return referralAgents.map((referralAgent) => this.mapper.toDomain(referralAgent))
  }

  async findAncestors(agent: ReferralAgent): Promise<Array<ReferralAgent>> {
    const entity = await this.repository.findOne(agent.id)

    if (!entity) {
      return []
    }

    const referralAgents = await this.em
      .createQueryBuilder(ReferralAgentEntity, 'agent')
      .where('agent.path @> ? and agent.path <> ?', [entity.path, entity.path])
      .getResult()

    return referralAgents.map((referralAgent) => this.mapper.toDomain(referralAgent))
  }

  async findByQuery({
    pager,
    order,
    query,
  }: FindReferralAgentsByQuery): Promise<FindReferralAgentsByQueryResult> {
    const [referralAgents, hasNextPage] = await new MikroORMQueryBuilder<ReferralAgentEntity>(
      this.em.createQueryBuilder(ReferralAgentEntity)
    )
      .id('id', query?.id)
      .order(order)
      .pager(pager)
      .execute()

    return {
      referralAgents: referralAgents.map((referralAgent) => this.mapper.toDomain(referralAgent)),
      hasNextPage,
    }
  }
}

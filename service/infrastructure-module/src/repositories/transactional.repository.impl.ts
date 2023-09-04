import type { Reward }                              from '@rewards-system/domain-module'
import type { RewardOperation }                     from '@rewards-system/domain-module'
import type { RecordMetadata }                      from '@monstrs/nestjs-cqrs-kafka-events'
import type { IEvent }                              from '@nestjs/cqrs'

import { Injectable }                               from '@nestjs/common'
import { Inject }                                   from '@nestjs/common'
import { EventBus }                                 from '@nestjs/cqrs'
import { InjectRepository }                         from '@mikro-orm/nestjs'
import { EntityManager as PostgreSqlEntityManager } from '@mikro-orm/postgresql'
import { EntityRepository }                         from '@mikro-orm/core'
import { EntityManager }                            from '@mikro-orm/core'

import { TransactionalRepository }                  from '@rewards-system/domain-module'

import { RewardEntity }                             from '../entities/index.js'
import { RewardOperationEntity }                    from '../entities/index.js'
import { RewardMapper }                             from '../mappers/index.js'
import { RewardOperationMapper }                    from '../mappers/index.js'

@Injectable()
export class TransactionalRepositoryImpl extends TransactionalRepository {
  constructor(
    @InjectRepository(RewardEntity)
    private readonly rewardRepository: EntityRepository<RewardEntity>,
    @InjectRepository(RewardOperationEntity)
    private readonly rewardOperationRepository: EntityRepository<RewardOperationEntity>,
    @Inject(EntityManager)
    private readonly em: PostgreSqlEntityManager,
    private readonly eventBus: EventBus,
    private readonly rewardOperationMapper: RewardOperationMapper,
    private readonly rewardMapper: RewardMapper
  ) {
    super()
  }

  override async saveOperationAndRewards(
    rewardOperation: RewardOperation,
    rewards: Array<Reward>
  ): Promise<void> {
    const rewardOperationEntity = await this.rewardOperationRepository.findOne(rewardOperation.id)
    const rewardEntities = await this.rewardRepository.find({
      id: { $in: rewards.map((reward) => reward.id) },
    })

    const em = this.em.fork()

    await em.begin()

    try {
      em.persist(
        this.rewardOperationMapper.toPersistence(
          rewardOperation,
          rewardOperationEntity || new RewardOperationEntity()
        )
      )

      rewards.forEach((reward) => {
        em.persist(
          this.rewardMapper.toPersistence(
            reward,
            rewardEntities.find((rewardEntity) => rewardEntity.id === reward.id) ||
              new RewardEntity()
          )
        )
      })

      await this.eventBus.publishAll<IEvent, Promise<Array<RecordMetadata>>>([
        ...rewardOperation.getUncommittedEvents(),
        ...rewards.map((reward) => reward.getUncommittedEvents()).flat(),
      ])

      rewardOperation.commit()
      rewards.forEach((reward) => {
        reward.commit()
      })

      await em.commit()
    } catch (error) {
      await em.rollback()

      throw error
    }
  }
}

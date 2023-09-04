/* eslint-disable no-param-reassign */

import type { ExtractProperties } from '@monstrs/base-types'

import type { RewardEntity }      from '../entities/index.js'

import { Injectable }             from '@nestjs/common'

import { Reward }                 from '@rewards-system/domain-module'

@Injectable()
export class RewardMapper {
  toDomain(entity: RewardEntity): Reward {
    const properties: Omit<ExtractProperties<Reward>, 'autoCommit'> = {
      id: entity.id,
      operationId: entity.operationId,
      agentId: entity.agentId,
      referrerId: entity.referrerId,
      status: entity.status,
      amount: entity.amount,
      profit: entity.profit,
      percentage: entity.percentage,
      level: entity.level,
      createdAt: entity.createdAt,
    }

    return Object.assign(new Reward(), properties)
  }

  toPersistence(aggregate: Reward, entity: RewardEntity): RewardEntity {
    entity.id = aggregate.id
    entity.operationId = aggregate.operationId
    entity.agentId = aggregate.agentId
    entity.referrerId = aggregate.referrerId
    entity.status = aggregate.status
    entity.amount = aggregate.amount
    entity.profit = aggregate.profit
    entity.percentage = aggregate.percentage
    entity.level = aggregate.level
    entity.createdAt = aggregate.createdAt

    return entity
  }
}

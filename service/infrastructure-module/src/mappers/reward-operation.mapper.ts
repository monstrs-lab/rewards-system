/* eslint-disable no-param-reassign */

import type { ExtractProperties }     from '@monstrs/base-types'
import type { RewardOperation }       from '@rewards-system/domain-module'

import type { RewardOperationEntity } from '../entities/index.js'

import { Injectable }                 from '@nestjs/common'

import { RewardOperationFactory }     from '@rewards-system/domain-module'
import { RewardOperationSource }      from '@rewards-system/domain-module'

@Injectable()
export class RewardOperationMapper {
  constructor(private readonly factory: RewardOperationFactory) {}

  toDomain(entity: RewardOperationEntity): RewardOperation {
    const sourceProperties: ExtractProperties<RewardOperationSource> = {
      id: entity.source.id,
      type: entity.source.type,
    }

    const properties: Omit<ExtractProperties<RewardOperation>, 'autoCommit'> = {
      id: entity.id,
      rewardProgramId: entity.rewardProgramId,
      referrerId: entity.referrerId,
      status: entity.status,
      amount: entity.amount,
      createdAt: entity.createdAt,
      source: Object.assign(new RewardOperationSource(), sourceProperties),
    }

    return Object.assign(this.factory.create(), properties)
  }

  toPersistence(aggregate: RewardOperation, entity: RewardOperationEntity): RewardOperationEntity {
    entity.id = aggregate.id
    entity.rewardProgramId = aggregate.rewardProgramId
    entity.referrerId = aggregate.referrerId
    entity.status = aggregate.status
    entity.source = {
      id: aggregate.source.id,
      type: aggregate.source.type,
    }

    entity.amount = aggregate.amount
    entity.createdAt = aggregate.createdAt

    return entity
  }
}

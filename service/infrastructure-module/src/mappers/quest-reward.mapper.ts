/* eslint-disable no-param-reassign */

import type { ExtractProperties } from '@monstrs/base-types'

import type { QuestRewardEntity } from '../entities/index.js'

import { Injectable }             from '@nestjs/common'
import { BigNumber }              from 'bignumber.js'

import { QuestReward }            from '@rewards-system/domain-module'
import { QuestRewardSource }      from '@rewards-system/domain-module'

@Injectable()
export class QuestRewardMapper {
  toDomain(entity: QuestRewardEntity): QuestReward {
    const sourceProperties: ExtractProperties<QuestRewardSource> = {
      id: entity.source.id,
      type: entity.source.type,
    }

    const properties: Omit<ExtractProperties<QuestReward>, 'autoCommit'> = {
      id: entity.id,
      recipientId: entity.recipientId,
      status: entity.status,
      amount: new BigNumber(entity.amount),
      createdAt: entity.createdAt,
      source: Object.assign(new QuestRewardSource(), sourceProperties),
    }

    return Object.assign(new QuestReward(), properties)
  }

  toPersistence(aggregate: QuestReward, entity: QuestRewardEntity): QuestRewardEntity {
    entity.id = aggregate.id
    entity.recipientId = aggregate.recipientId
    entity.status = aggregate.status
    entity.amount = aggregate.amount.toString()
    entity.createdAt = aggregate.createdAt
    entity.source = {
      id: aggregate.source.id,
      type: aggregate.source.type,
    }

    return entity
  }
}

/* eslint-disable no-param-reassign */

import type { ExtractProperties } from '@monstrs/base-types'

import type { RewardAgentEntity } from '../entities/index.js'

import { Injectable }             from '@nestjs/common'

import { RewardAgent }            from '@rewards-system/domain-module'

@Injectable()
export class RewardAgentMapper {
  toDomain(entity: RewardAgentEntity): RewardAgent {
    const properties: Omit<ExtractProperties<RewardAgent>, 'autoCommit'> = {
      id: entity.id,
      code: entity.code,
      parentId: entity.parentId,
      metadata: entity.metadata,
    }

    return Object.assign(new RewardAgent(), properties)
  }

  toPersistence(aggregate: RewardAgent, entity: RewardAgentEntity): RewardAgentEntity {
    entity.assign({
      id: aggregate.id,
      code: aggregate.code,
      parentId: aggregate.parentId,
    })

    entity.metadata = aggregate.metadata

    return entity
  }
}

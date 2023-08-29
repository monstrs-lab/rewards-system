/* eslint-disable no-param-reassign */

import type { ExtractProperties }   from '@monstrs/base-types'
import type { ReferralAgent }       from '@referral-programs/domain-module'

import type { ReferralAgentEntity } from '../entities/index.js'

import { Injectable }               from '@nestjs/common'

import { ReferralAgentFactory }     from '@referral-programs/domain-module'

@Injectable()
export class ReferralAgentMapper {
  constructor(private readonly factory: ReferralAgentFactory) {}

  toDomain(entity: ReferralAgentEntity): ReferralAgent {
    const properties: Omit<ExtractProperties<ReferralAgent>, 'autoCommit'> = {
      id: entity.id,
      code: entity.code,
      parentId: entity.parentId,
      metadata: entity.metadata,
    }

    return Object.assign(this.factory.create(), properties)
  }

  toPersistence(aggregate: ReferralAgent, entity: ReferralAgentEntity): ReferralAgentEntity {
    entity.assign({
      id: aggregate.id,
      code: aggregate.code,
      parentId: aggregate.parentId,
    })

    entity.metadata = aggregate.metadata

    return entity
  }
}

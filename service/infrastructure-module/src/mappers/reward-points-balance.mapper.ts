import type { ExtractProperties }         from '@monstrs/base-types'
import type { RewardPointsBalance }       from '@rewards-system/domain-module'

import type { RewardPointsBalanceEntity } from '../entities/index.js'

import { Injectable }                     from '@nestjs/common'

import { RewardPointsBalanceFactory }     from '@rewards-system/domain-module'

@Injectable()
export class RewardPointsBalanceMapper {
  constructor(private readonly factory: RewardPointsBalanceFactory) {}

  toDomain(entity: RewardPointsBalanceEntity): RewardPointsBalance {
    const properties: Omit<ExtractProperties<RewardPointsBalance>, 'autoCommit'> = {
      id: entity.id,
      amount: entity.amount,
    }

    return Object.assign(this.factory.create(), properties)
  }

  toPersistence(
    aggregate: RewardPointsBalance,
    entity: RewardPointsBalanceEntity
  ): RewardPointsBalanceEntity {
    entity.assign({
      id: aggregate.id,
      amount: aggregate.amount,
    })

    return entity
  }
}

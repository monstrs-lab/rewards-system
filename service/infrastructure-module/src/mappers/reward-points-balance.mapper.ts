import type { ExtractProperties }         from '@monstrs/base-types'

import type { RewardPointsBalanceEntity } from '../entities/index.js'

import { Injectable }                     from '@nestjs/common'

import { RewardPointsBalance }            from '@rewards-system/domain-module'

@Injectable()
export class RewardPointsBalanceMapper {
  toDomain(entity: RewardPointsBalanceEntity): RewardPointsBalance {
    const properties: Omit<ExtractProperties<RewardPointsBalance>, 'autoCommit'> = {
      id: entity.id,
      amount: entity.amount,
    }

    return Object.assign(new RewardPointsBalance(), properties)
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

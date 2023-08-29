import type { ExtractProperties }           from '@monstrs/base-types'
import type { ReferralPointsBalance }       from '@referral-programs/domain-module'

import type { ReferralPointsBalanceEntity } from '../entities/index.js'

import { Injectable }                       from '@nestjs/common'

import { ReferralPointsBalanceFactory }     from '@referral-programs/domain-module'

@Injectable()
export class ReferralPointsBalanceMapper {
  constructor(private readonly factory: ReferralPointsBalanceFactory) {}

  toDomain(entity: ReferralPointsBalanceEntity): ReferralPointsBalance {
    const properties: Omit<ExtractProperties<ReferralPointsBalance>, 'autoCommit'> = {
      id: entity.id,
      amount: entity.amount,
    }

    return Object.assign(this.factory.create(), properties)
  }

  toPersistence(
    aggregate: ReferralPointsBalance,
    entity: ReferralPointsBalanceEntity
  ): ReferralPointsBalanceEntity {
    entity.assign({
      id: aggregate.id,
      amount: aggregate.amount,
    })

    return entity
  }
}

import type { ExtractProperties }    from '@monstrs/base-types'
import type { ReferralProfit }       from '@referral-programs/domain-module'

import type { ReferralProfitEntity } from '../entities/index.js'

import { Injectable }                from '@nestjs/common'

import { ReferralProfitFactory }     from '@referral-programs/domain-module'

@Injectable()
export class ReferralProfitMapper {
  constructor(private readonly factory: ReferralProfitFactory) {}

  toDomain(entity: ReferralProfitEntity): ReferralProfit {
    const properties: Omit<ExtractProperties<ReferralProfit>, 'autoCommit'> = {
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

    return Object.assign(this.factory.create(), properties)
  }

  toPersistence(aggregate: ReferralProfit, entity: ReferralProfitEntity): ReferralProfitEntity {
    entity.assign({
      id: aggregate.id,
      operationId: aggregate.operationId,
      agentId: aggregate.agentId,
      referrerId: aggregate.referrerId,
      status: aggregate.status,
      amount: aggregate.amount,
      profit: aggregate.profit,
      percentage: aggregate.percentage,
      level: aggregate.level,
      createdAt: aggregate.createdAt,
    })

    return entity
  }
}

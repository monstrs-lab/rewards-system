/* eslint-disable no-param-reassign */

import type { ExtractProperties }       from '@monstrs/base-types'
import type { ReferralOperation }       from '@referral-programs/domain-module'

import type { ReferralOperationEntity } from '../entities/index.js'

import { Injectable }                   from '@nestjs/common'

import { ReferralOperationFactory }     from '@referral-programs/domain-module'
import { ReferralOperationSource }      from '@referral-programs/domain-module'

@Injectable()
export class ReferralOperationMapper {
  constructor(private readonly factory: ReferralOperationFactory) {}

  toDomain(entity: ReferralOperationEntity): ReferralOperation {
    const sourceProperties: ExtractProperties<ReferralOperationSource> = {
      id: entity.source.id,
      type: entity.source.type,
    }

    const properties: Omit<ExtractProperties<ReferralOperation>, 'autoCommit'> = {
      id: entity.id,
      referralProgramId: entity.referralProgramId,
      referrerId: entity.referrerId,
      status: entity.status,
      amount: entity.amount,
      createdAt: entity.createdAt,
      source: Object.assign(new ReferralOperationSource(), sourceProperties),
    }

    return Object.assign(this.factory.create(), properties)
  }

  toPersistence(
    aggregate: ReferralOperation,
    entity: ReferralOperationEntity
  ): ReferralOperationEntity {
    entity.id = aggregate.id
    entity.referralProgramId = aggregate.referralProgramId
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

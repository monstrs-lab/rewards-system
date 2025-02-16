/* eslint-disable no-param-reassign */

import type { ExtractProperties } from '@monstrs/base-types'

import type { WithdrawalEntity }  from '../entities/index.js'

import { Injectable }             from '@nestjs/common'
import { BigNumber }              from 'bignumber.js'

import { Withdrawal }             from '@rewards-system/domain-module'

@Injectable()
export class WithdrawalMapper {
  toDomain(entity: WithdrawalEntity): Withdrawal {
    const properties: Omit<ExtractProperties<Withdrawal>, 'autoCommit'> = {
      id: entity.id,
      ownerId: entity.ownerId,
      amount: new BigNumber(entity.amount),
      createdAt: entity.createdAt,
    }

    return Object.assign(new Withdrawal(), properties)
  }

  toPersistence(aggregate: Withdrawal, entity: WithdrawalEntity): WithdrawalEntity {
    entity.id = aggregate.id
    entity.ownerId = aggregate.ownerId
    entity.amount = aggregate.amount.toString()
    entity.createdAt = aggregate.createdAt

    return entity
  }
}

/* eslint-disable @typescript-eslint/consistent-type-imports */

import type { FindRewardPointsBalancesByQueryResult } from '@rewards-system/domain-module'
import type { ServiceImpl }                           from '@rewards-system/rewards-system-rpc'
import type { ListRewardPointsBalancesRequest }       from '@rewards-system/rewards-system-rpc/interfaces'
import type { ListRewardPointsBalancesResponse }      from '@rewards-system/rewards-system-rpc/interfaces'

import { UseFilters }                                 from '@nestjs/common'
import { Controller }                                 from '@nestjs/common'
import { QueryBus }                                   from '@nestjs/cqrs'
import { Validator }                                  from '@monstrs/nestjs-validation'
import { BufExceptionsFilter }                        from '@monstrs/nestjs-buf-errors'
import { BufMethod }                                  from '@wolfcoded/nestjs-bufconnect'
import { BufService }                                 from '@wolfcoded/nestjs-bufconnect'

import { RewardPointsService }                        from '@rewards-system/rewards-system-rpc/connect'
import { GetRewardPointsBalancesQuery }               from '@rewards-system/application-module'

import { ListRewardPointsBalancesPayload }            from '../payloads/index.js'
import { ListRewardPointsBalancesSerializer }         from '../serializers/index.js'

@Controller()
@BufService(RewardPointsService)
@UseFilters(BufExceptionsFilter)
export class RewardPointsController implements ServiceImpl<typeof RewardPointsService> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly validator: Validator
  ) {}

  @BufMethod()
  async listRewardPointsBalances(
    request: ListRewardPointsBalancesRequest
  ): Promise<ListRewardPointsBalancesResponse> {
    const payload = new ListRewardPointsBalancesPayload(request)

    await this.validator.validate(payload)

    return new ListRewardPointsBalancesSerializer(
      await this.queryBus.execute<
        GetRewardPointsBalancesQuery,
        FindRewardPointsBalancesByQueryResult
      >(new GetRewardPointsBalancesQuery(payload.pager, payload.order, payload.query))
    )
  }
}

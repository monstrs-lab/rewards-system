/* eslint-disable @typescript-eslint/consistent-type-imports */

import type { FindReferralPointsBalancesByQueryResult } from '@referral-programs/domain-module'
import type { ServiceImpl }                             from '@referral-programs/referral-programs-rpc'
import type { ListReferralPointsBalancesRequest }       from '@referral-programs/referral-programs-rpc/interfaces'
import type { ListReferralPointsBalancesResponse }      from '@referral-programs/referral-programs-rpc/interfaces'

import { UseFilters }                                   from '@nestjs/common'
import { Controller }                                   from '@nestjs/common'
import { QueryBus }                                     from '@nestjs/cqrs'
import { Validator }                                    from '@monstrs/nestjs-validation'
import { BufExceptionsFilter }                          from '@monstrs/nestjs-buf-errors'
import { BufMethod }                                    from '@wolfcoded/nestjs-bufconnect'
import { BufService }                                   from '@wolfcoded/nestjs-bufconnect'

import { ReferralPointsService }                        from '@referral-programs/referral-programs-rpc/connect'
import { GetReferralPointsBalancesQuery }               from '@referral-programs/application-module'

import { ListReferralPointsBalancesPayload }            from '../payloads/index.js'
import { ListReferralPointsBalancesSerializer }         from '../serializers/index.js'

@Controller()
@BufService(ReferralPointsService)
@UseFilters(BufExceptionsFilter)
export class ReferralPointsController implements ServiceImpl<typeof ReferralPointsService> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly validator: Validator
  ) {}

  @BufMethod()
  async listReferralPointsBalances(
    request: ListReferralPointsBalancesRequest
  ): Promise<ListReferralPointsBalancesResponse> {
    const payload = new ListReferralPointsBalancesPayload(request)

    await this.validator.validate(payload)

    return new ListReferralPointsBalancesSerializer(
      await this.queryBus.execute<
        GetReferralPointsBalancesQuery,
        FindReferralPointsBalancesByQueryResult
      >(new GetReferralPointsBalancesQuery(payload.pager, payload.order, payload.query))
    )
  }
}

import type { ServiceImpl }                           from '@connectrpc/connect'
import type { FindRewardPointsBalancesByQueryResult } from '@rewards-system/domain-module'
import type { ListRewardPointsBalancesRequest }       from '@rewards-system/rewards-rpc/interfaces'
import type { ListRewardPointsBalancesResponse }      from '@rewards-system/rewards-rpc/interfaces'

import { ConnectRpcMethod }                           from '@monstrs/nestjs-connectrpc'
import { ConnectRpcService }                          from '@monstrs/nestjs-connectrpc'
import { ConnectRpcExceptionsFilter }                 from '@monstrs/nestjs-connectrpc-errors'
import { Validator }                                  from '@monstrs/nestjs-validation'
import { UseFilters }                                 from '@nestjs/common'
import { Controller }                                 from '@nestjs/common'
import { QueryBus }                                   from '@nestjs/cqrs'

import { GetRewardPointsBalancesQuery }               from '@rewards-system/application-module'
import { RewardPointsService }                        from '@rewards-system/rewards-rpc/connect'

import { ListRewardPointsBalancesPayload }            from '../payloads/index.js'
import { ListRewardPointsBalancesSerializer }         from '../serializers/index.js'

@Controller()
@ConnectRpcService(RewardPointsService)
@UseFilters(ConnectRpcExceptionsFilter)
export class RewardPointsController implements ServiceImpl<typeof RewardPointsService> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly validator: Validator
  ) {}

  @ConnectRpcMethod()
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

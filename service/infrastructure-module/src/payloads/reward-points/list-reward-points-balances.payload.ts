/* eslint-disable max-classes-per-file */

import type { ListRewardPointsBalancesRequest_RewardPointsBalancesQuery } from '@rewards-system/rewards-system-rpc/interfaces'
import type { ListRewardPointsBalancesRequest }                           from '@rewards-system/rewards-system-rpc/interfaces'

import { IdQueryPayload }                                                 from '@monstrs/rpc-query-payloads'
import { OrderPayload }                                                   from '@monstrs/rpc-query-payloads'
import { PagerPayload }                                                   from '@monstrs/rpc-query-payloads'
import { IsOptional }                                                     from 'class-validator'
import { ValidateNested }                                                 from 'class-validator'

export class ListRewardPointsBalancesQueryPayload {
  constructor(private readonly query: ListRewardPointsBalancesRequest_RewardPointsBalancesQuery) {}

  @IsOptional()
  @ValidateNested()
  get id(): IdQueryPayload {
    return new IdQueryPayload(this.query.id)
  }
}

export class ListRewardPointsBalancesPayload {
  constructor(private readonly request: ListRewardPointsBalancesRequest) {}

  @IsOptional()
  @ValidateNested()
  get pager(): PagerPayload | undefined {
    return this.request.pager ? new PagerPayload(this.request.pager) : undefined
  }

  @IsOptional()
  @ValidateNested()
  get order(): OrderPayload | undefined {
    return this.request.order ? new OrderPayload(this.request.order) : undefined
  }

  @IsOptional()
  @ValidateNested()
  get query(): ListRewardPointsBalancesQueryPayload | undefined {
    return this.request.query
      ? new ListRewardPointsBalancesQueryPayload(this.request.query)
      : undefined
  }
}

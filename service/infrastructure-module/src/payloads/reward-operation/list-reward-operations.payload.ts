/* eslint-disable max-classes-per-file */

import type { ListRewardOperationsRequest_RewardOperationsQuery } from '@rewards-system/rewards-rpc/interfaces'
import type { ListRewardOperationsRequest }                       from '@rewards-system/rewards-rpc/interfaces'

import { IdQueryPayload }                                         from '@monstrs/rpc-query-payloads'
import { OrderPayload }                                           from '@monstrs/rpc-query-payloads'
import { PagerPayload }                                           from '@monstrs/rpc-query-payloads'
import { IsOptional }                                             from 'class-validator'
import { ValidateNested }                                         from 'class-validator'

export class ListRewardOperationsQueryPayload {
  constructor(private readonly query: ListRewardOperationsRequest_RewardOperationsQuery) {}

  @IsOptional()
  @ValidateNested()
  get id(): IdQueryPayload {
    return new IdQueryPayload(this.query.id)
  }
}

export class ListRewardOperationsPayload {
  constructor(private readonly request: ListRewardOperationsRequest) {}

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
  get query(): ListRewardOperationsQueryPayload | undefined {
    return this.request.query ? new ListRewardOperationsQueryPayload(this.request.query) : undefined
  }
}

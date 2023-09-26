/* eslint-disable max-classes-per-file */

import type { ListRewardsRequest_RewardsQuery } from '@rewards-system/rewards-rpc/interfaces'
import type { ListRewardsRequest }              from '@rewards-system/rewards-rpc/interfaces'

import { IdQueryPayload }                       from '@monstrs/rpc-query-payloads'
import { OrderPayload }                         from '@monstrs/rpc-query-payloads'
import { PagerPayload }                         from '@monstrs/rpc-query-payloads'
import { IsOptional }                           from 'class-validator'
import { ValidateNested }                       from 'class-validator'

export class ListRewardsQueryPayload {
  constructor(private readonly query: ListRewardsRequest_RewardsQuery) {}

  @IsOptional()
  @ValidateNested()
  get id(): IdQueryPayload {
    return new IdQueryPayload(this.query.id)
  }

  @IsOptional()
  @ValidateNested()
  get operationId(): IdQueryPayload {
    return new IdQueryPayload(this.query.operationId)
  }

  @IsOptional()
  @ValidateNested()
  get agentId(): IdQueryPayload {
    return new IdQueryPayload(this.query.agentId)
  }
}

export class ListRewardsPayload {
  constructor(private readonly request: ListRewardsRequest) {}

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
  get query(): ListRewardsQueryPayload | undefined {
    return this.request.query ? new ListRewardsQueryPayload(this.request.query) : undefined
  }
}

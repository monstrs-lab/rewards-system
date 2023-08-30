/* eslint-disable max-classes-per-file */

import type { ListRewardProgramsRequest_RewardProgramsQuery } from '@rewards-system/rewards-system-rpc/interfaces'
import type { ListRewardProgramsRequest }                     from '@rewards-system/rewards-system-rpc/interfaces'

import { IdQueryPayload }                                     from '@monstrs/rpc-query-payloads'
import { OrderPayload }                                       from '@monstrs/rpc-query-payloads'
import { PagerPayload }                                       from '@monstrs/rpc-query-payloads'
import { IsOptional }                                         from 'class-validator'
import { ValidateNested }                                     from 'class-validator'

export class ListRewardProgramsQueryPayload {
  constructor(private readonly query: ListRewardProgramsRequest_RewardProgramsQuery) {}

  @IsOptional()
  @ValidateNested()
  get id(): IdQueryPayload {
    return new IdQueryPayload(this.query.id)
  }
}

export class ListRewardProgramsPayload {
  constructor(private readonly request: ListRewardProgramsRequest) {}

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
  get query(): ListRewardProgramsQueryPayload | undefined {
    return this.request.query ? new ListRewardProgramsQueryPayload(this.request.query) : undefined
  }
}

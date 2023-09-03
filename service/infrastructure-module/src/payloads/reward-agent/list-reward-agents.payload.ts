/* eslint-disable max-classes-per-file */

import type { ListRewardAgentsRequest_RewardAgentsQuery } from '@rewards-system/rewards-rpc/interfaces'
import type { ListRewardAgentsRequest }                   from '@rewards-system/rewards-rpc/interfaces'

import { IdQueryPayload }                                 from '@monstrs/rpc-query-payloads'
import { OrderPayload }                                   from '@monstrs/rpc-query-payloads'
import { PagerPayload }                                   from '@monstrs/rpc-query-payloads'
import { IsOptional }                                     from 'class-validator'
import { ValidateNested }                                 from 'class-validator'

export class ListRewardAgentsQueryPayload {
  constructor(private readonly query: ListRewardAgentsRequest_RewardAgentsQuery) {}

  @IsOptional()
  @ValidateNested()
  get id(): IdQueryPayload {
    return new IdQueryPayload(this.query.id)
  }
}

export class ListRewardAgentsPayload {
  constructor(private readonly request: ListRewardAgentsRequest) {}

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
  get query(): ListRewardAgentsQueryPayload | undefined {
    return this.request.query ? new ListRewardAgentsQueryPayload(this.request.query) : undefined
  }
}

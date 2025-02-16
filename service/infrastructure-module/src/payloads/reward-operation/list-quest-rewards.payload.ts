/* eslint-disable max-classes-per-file */

import type { ListQuestRewardsRequest_QuestRewardsQuery } from '@rewards-system/rewards-rpc/interfaces'
import type { ListQuestRewardsRequest }                   from '@rewards-system/rewards-rpc/interfaces'

import { IdQueryPayload }                                 from '@monstrs/rpc-query-payloads'
import { OrderPayload }                                   from '@monstrs/rpc-query-payloads'
import { PagerPayload }                                   from '@monstrs/rpc-query-payloads'
import { IsOptional }                                     from 'class-validator'
import { ValidateNested }                                 from 'class-validator'

export class ListQuestRewardsQueryPayload {
  constructor(private readonly query: ListQuestRewardsRequest_QuestRewardsQuery) {}

  @IsOptional()
  @ValidateNested()
  get id(): IdQueryPayload {
    return new IdQueryPayload(this.query.id)
  }

  @IsOptional()
  @ValidateNested()
  get recipientId(): IdQueryPayload {
    return new IdQueryPayload(this.query.recipientId)
  }
}

export class ListQuestRewardsPayload {
  constructor(private readonly request: ListQuestRewardsRequest) {}

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
  get query(): ListQuestRewardsQueryPayload | undefined {
    return this.request.query ? new ListQuestRewardsQueryPayload(this.request.query) : undefined
  }
}

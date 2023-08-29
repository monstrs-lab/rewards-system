/* eslint-disable max-classes-per-file */

import type { ListReferralAgentsRequest_ReferralAgentsQuery } from '@referral-programs/referral-programs-rpc/interfaces'
import type { ListReferralAgentsRequest }                     from '@referral-programs/referral-programs-rpc/interfaces'

import { IdQueryPayload }                                     from '@monstrs/rpc-query-payloads'
import { OrderPayload }                                       from '@monstrs/rpc-query-payloads'
import { PagerPayload }                                       from '@monstrs/rpc-query-payloads'
import { IsOptional }                                         from 'class-validator'
import { ValidateNested }                                     from 'class-validator'

export class ListReferralAgentsQueryPayload {
  constructor(private readonly query: ListReferralAgentsRequest_ReferralAgentsQuery) {}

  @IsOptional()
  @ValidateNested()
  get id(): IdQueryPayload {
    return new IdQueryPayload(this.query.id)
  }
}

export class ListReferralAgentsPayload {
  constructor(private readonly request: ListReferralAgentsRequest) {}

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
  get query(): ListReferralAgentsQueryPayload | undefined {
    return this.request.query ? new ListReferralAgentsQueryPayload(this.request.query) : undefined
  }
}

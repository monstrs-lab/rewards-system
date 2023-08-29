/* eslint-disable max-classes-per-file */

import type { ListReferralProfitsRequest_ReferralProfitsQuery } from '@referral-programs/referral-programs-rpc/interfaces'
import type { ListReferralProfitsRequest }                      from '@referral-programs/referral-programs-rpc/interfaces'

import { IdQueryPayload }                                       from '@monstrs/rpc-query-payloads'
import { OrderPayload }                                         from '@monstrs/rpc-query-payloads'
import { PagerPayload }                                         from '@monstrs/rpc-query-payloads'
import { IsOptional }                                           from 'class-validator'
import { ValidateNested }                                       from 'class-validator'

export class ListReferralProfitsQueryPayload {
  constructor(private readonly query: ListReferralProfitsRequest_ReferralProfitsQuery) {}

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

export class ListReferralProfitsPayload {
  constructor(private readonly request: ListReferralProfitsRequest) {}

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
  get query(): ListReferralProfitsQueryPayload | undefined {
    return this.request.query ? new ListReferralProfitsQueryPayload(this.request.query) : undefined
  }
}

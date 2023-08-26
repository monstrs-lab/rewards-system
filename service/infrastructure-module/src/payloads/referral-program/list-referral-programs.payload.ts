/* eslint-disable max-classes-per-file */

import type { ListReferralProgramsRequest_ReferralProgramsQuery } from '@referral-programs/referral-programs-rpc/interfaces'
import type { ListReferralProgramsRequest }                       from '@referral-programs/referral-programs-rpc/interfaces'

import { IdQueryPayload }                                         from '@monstrs/rpc-query-payloads'
import { OrderPayload }                                           from '@monstrs/rpc-query-payloads'
import { PagerPayload }                                           from '@monstrs/rpc-query-payloads'
import { IsOptional }                                             from 'class-validator'
import { ValidateNested }                                         from 'class-validator'

export class ListReferralProgramsQueryPayload {
  constructor(private readonly query: ListReferralProgramsRequest_ReferralProgramsQuery) {}

  @IsOptional()
  @ValidateNested()
  get id(): IdQueryPayload {
    return new IdQueryPayload(this.query.id)
  }
}

export class ListReferralProgramsPayload {
  constructor(private readonly request: ListReferralProgramsRequest) {}

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
  get query(): ListReferralProgramsQueryPayload | undefined {
    return this.request.query ? new ListReferralProgramsQueryPayload(this.request.query) : undefined
  }
}

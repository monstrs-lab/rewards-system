/* eslint-disable max-classes-per-file */

import type { ListReferralOperationsRequest_ReferralOperationsQuery } from '@referral-programs/referral-programs-rpc/interfaces'
import type { ListReferralOperationsRequest }                         from '@referral-programs/referral-programs-rpc/interfaces'

import { IdQueryPayload }                                             from '@monstrs/rpc-query-payloads'
import { OrderPayload }                                               from '@monstrs/rpc-query-payloads'
import { PagerPayload }                                               from '@monstrs/rpc-query-payloads'
import { IsOptional }                                                 from 'class-validator'
import { ValidateNested }                                             from 'class-validator'

export class ListReferralOperationsQueryPayload {
  constructor(private readonly query: ListReferralOperationsRequest_ReferralOperationsQuery) {}

  @IsOptional()
  @ValidateNested()
  get id(): IdQueryPayload {
    return new IdQueryPayload(this.query.id)
  }
}

export class ListReferralOperationsPayload {
  constructor(private readonly request: ListReferralOperationsRequest) {}

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
  get query(): ListReferralOperationsQueryPayload | undefined {
    return this.request.query
      ? new ListReferralOperationsQueryPayload(this.request.query)
      : undefined
  }
}

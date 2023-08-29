/* eslint-disable max-classes-per-file */

import type { ListReferralPointsBalancesRequest_ReferralPointsBalancesQuery } from '@referral-programs/referral-programs-rpc/interfaces'
import type { ListReferralPointsBalancesRequest }                             from '@referral-programs/referral-programs-rpc/interfaces'

import { IdQueryPayload }                                                     from '@monstrs/rpc-query-payloads'
import { OrderPayload }                                                       from '@monstrs/rpc-query-payloads'
import { PagerPayload }                                                       from '@monstrs/rpc-query-payloads'
import { IsOptional }                                                         from 'class-validator'
import { ValidateNested }                                                     from 'class-validator'

export class ListReferralPointsBalancesQueryPayload {
  constructor(
    private readonly query: ListReferralPointsBalancesRequest_ReferralPointsBalancesQuery
  ) {}

  @IsOptional()
  @ValidateNested()
  get id(): IdQueryPayload {
    return new IdQueryPayload(this.query.id)
  }
}

export class ListReferralPointsBalancesPayload {
  constructor(private readonly request: ListReferralPointsBalancesRequest) {}

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
  get query(): ListReferralPointsBalancesQueryPayload | undefined {
    return this.request.query
      ? new ListReferralPointsBalancesQueryPayload(this.request.query)
      : undefined
  }
}

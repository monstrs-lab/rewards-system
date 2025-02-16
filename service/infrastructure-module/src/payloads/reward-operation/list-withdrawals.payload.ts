/* eslint-disable max-classes-per-file */

import type { ListWithdrawalsRequest_WithdrawalsQuery } from '@rewards-system/rewards-rpc/interfaces'
import type { ListWithdrawalsRequest }                  from '@rewards-system/rewards-rpc/interfaces'

import { IdQueryPayload }                               from '@monstrs/rpc-query-payloads'
import { OrderPayload }                                 from '@monstrs/rpc-query-payloads'
import { PagerPayload }                                 from '@monstrs/rpc-query-payloads'
import { IsOptional }                                   from 'class-validator'
import { ValidateNested }                               from 'class-validator'

export class ListWithdrawalsQueryPayload {
  constructor(private readonly query: ListWithdrawalsRequest_WithdrawalsQuery) {}

  @IsOptional()
  @ValidateNested()
  get id(): IdQueryPayload {
    return new IdQueryPayload(this.query.id)
  }

  @IsOptional()
  @ValidateNested()
  get ownerId(): IdQueryPayload {
    return new IdQueryPayload(this.query.ownerId)
  }
}

export class ListWithdrawalsPayload {
  constructor(private readonly request: ListWithdrawalsRequest) {}

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
  get query(): ListWithdrawalsQueryPayload | undefined {
    return this.request.query ? new ListWithdrawalsQueryPayload(this.request.query) : undefined
  }
}

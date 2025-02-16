import type { CreateWithdrawalRequest } from '@rewards-system/rewards-rpc/interfaces'

import { IsUUID }                       from 'class-validator'
import { Min }                          from 'class-validator'

export class CreateWithdrawalPayload {
  constructor(private readonly request: CreateWithdrawalRequest) {}

  @IsUUID(4)
  get ownerId(): string {
    return this.request.ownerId
  }

  @Min(1)
  get amount(): number {
    return this.request.amount
  }
}

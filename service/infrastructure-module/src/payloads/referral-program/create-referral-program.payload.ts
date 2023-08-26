import type { CreateReferralProgramRequest } from '@referral-programs/referral-programs-rpc/interfaces'

import { IsNotEmpty }                        from 'class-validator'
import { Max }                               from 'class-validator'
import { Min }                               from 'class-validator'

export class CreateReferralProgramPayload {
  constructor(private readonly request: CreateReferralProgramRequest) {}

  @IsNotEmpty()
  get name(): string {
    return this.request.name
  }

  @IsNotEmpty()
  get code(): string {
    return this.request.code
  }

  @Min(1)
  @Max(100)
  get percentage(): number {
    return this.request.percentage
  }
}

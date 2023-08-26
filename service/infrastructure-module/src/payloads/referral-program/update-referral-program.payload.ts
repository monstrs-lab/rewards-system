import type { UpdateReferralProgramRequest } from '@referral-programs/referral-programs-rpc/interfaces'

import { IsNotEmpty }                        from 'class-validator'
import { IsUUID }                            from 'class-validator'
import { Min }                               from 'class-validator'
import { Max }                               from 'class-validator'

export class UpdateReferralProgramPayload {
  constructor(private readonly request: UpdateReferralProgramRequest) {}

  @IsUUID(4)
  get referralProgramId(): string {
    return this.request.referralProgramId
  }

  @IsNotEmpty()
  get name(): string {
    return this.request.name
  }

  @Min(1)
  @Max(100)
  get percentage(): number {
    return this.request.percentage
  }
}

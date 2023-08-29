import type { CreateAndConfirmReferralOperationRequest } from '@referral-programs/referral-programs-rpc/interfaces'

import { IsNotEmpty }                                    from 'class-validator'
import { IsUUID }                                        from 'class-validator'
import { Min }                                           from 'class-validator'

export class CreateAndConfirmReferralOperationPayload {
  constructor(private readonly request: CreateAndConfirmReferralOperationRequest) {}

  @IsNotEmpty()
  get referralProgram(): string {
    return this.request.referralProgram
  }

  @IsUUID(4)
  get referrerId(): string {
    return this.request.referrerId
  }

  @IsUUID(4)
  get sourceId(): string {
    return this.request.sourceId
  }

  @IsNotEmpty()
  get sourceType(): string {
    return this.request.sourceType
  }

  @Min(1)
  get amount(): number {
    return this.request.amount
  }
}

import type { ConfirmReferralOperationRequest } from '@referral-programs/referral-programs-rpc/interfaces'

import { IsUUID }                               from 'class-validator'

export class ConfirmReferralOperationPayload {
  constructor(private readonly request: ConfirmReferralOperationRequest) {}

  @IsUUID(4)
  get referralOperationId(): string {
    return this.request.referralOperationId
  }
}

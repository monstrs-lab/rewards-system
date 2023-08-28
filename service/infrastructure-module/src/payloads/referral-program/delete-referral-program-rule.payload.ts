import type { DeleteReferralProgramRuleRequest } from '@referral-programs/referral-programs-rpc/interfaces'

import { IsUUID }                                from 'class-validator'

export class DeleteReferralProgramRulePayload {
  constructor(private readonly request: DeleteReferralProgramRuleRequest) {}

  @IsUUID(4)
  get referralProgramId(): string {
    return this.request.referralProgramId
  }

  @IsUUID(4)
  get referralProgramRuleId(): string {
    return this.request.referralProgramRuleId
  }
}

import type { CreateReferralAgentRequest } from '@referral-programs/referral-programs-rpc/interfaces'

import { IsUUID }                          from 'class-validator'

export class CreateReferralAgentPayload {
  constructor(private readonly request: CreateReferralAgentRequest) {}

  @IsUUID(4)
  get id(): string {
    return this.request.id
  }

  get referralCode(): string | undefined {
    return this.request.referralCode
  }
}

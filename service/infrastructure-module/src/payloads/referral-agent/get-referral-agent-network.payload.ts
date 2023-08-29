import type { GetReferralAgentNetworkRequest } from '@referral-programs/referral-programs-rpc/interfaces'

import { IsUUID }                              from 'class-validator'

export class GetReferralAgentNetworkPayload {
  constructor(private readonly request: GetReferralAgentNetworkRequest) {}

  @IsUUID(4)
  get referralAgentId(): string {
    return this.request.referralAgentId
  }
}

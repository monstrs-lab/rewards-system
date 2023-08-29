import type { AddReferralAgentMetadataRequest } from '@referral-programs/referral-programs-rpc/interfaces'

import { IsNotEmptyObject }                     from 'class-validator'
import { IsUUID }                               from 'class-validator'

export class AddReferralAgentMetadataPayload {
  constructor(private readonly request: AddReferralAgentMetadataRequest) {}

  @IsUUID(4)
  get referralAgentId(): string {
    return this.request.referralAgentId
  }

  @IsNotEmptyObject()
  get metadata(): Record<string, any> {
    return this.request.metadata?.toJson() as Record<string, any>
  }
}

import type { CreateRewardAgentRequest } from '@rewards-system/rewards-rpc/interfaces'

import { IsUUID }                        from 'class-validator'

export class CreateRewardAgentPayload {
  constructor(private readonly request: CreateRewardAgentRequest) {}

  @IsUUID(4)
  get id(): string {
    return this.request.id
  }

  get referralCode(): string | undefined {
    return this.request.referralCode
  }
}

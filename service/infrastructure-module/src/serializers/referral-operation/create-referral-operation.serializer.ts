import type { ReferralOperation }          from '@referral-programs/domain-module'

import { CreateReferralOperationResponse } from '@referral-programs/referral-programs-rpc/abstractions'

import { ReferralOperationSerializer }     from './referral-operation.serializer.js'

export class CreateReferralOperationSerializer extends CreateReferralOperationResponse {
  constructor(private readonly referralOperation: ReferralOperation) {
    super()
  }

  get result(): ReferralOperationSerializer {
    return new ReferralOperationSerializer(this.referralOperation)
  }
}

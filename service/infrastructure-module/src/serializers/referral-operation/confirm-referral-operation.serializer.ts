import type { ReferralOperation }           from '@referral-programs/domain-module'

import { ConfirmReferralOperationResponse } from '@referral-programs/referral-programs-rpc/abstractions'

import { ReferralOperationSerializer }      from './referral-operation.serializer.js'

export class ConfirmReferralOperationSerializer extends ConfirmReferralOperationResponse {
  constructor(private readonly referralOperation: ReferralOperation) {
    super()
  }

  get result(): ReferralOperationSerializer {
    return new ReferralOperationSerializer(this.referralOperation)
  }
}

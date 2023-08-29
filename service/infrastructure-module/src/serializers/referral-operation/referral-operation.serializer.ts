import type { ReferralOperation } from '@referral-programs/domain-module'

import { Timestamp }              from '@bufbuild/protobuf'

import * as rpc                   from '@referral-programs/referral-programs-rpc/abstractions'

export class ReferralOperationSerializer extends rpc.ReferralOperation {
  constructor(private readonly referralOperation: ReferralOperation) {
    super()
  }

  get id(): string {
    return this.referralOperation.id
  }

  get referralProgramId(): string {
    return this.referralOperation.referralProgramId
  }

  get status(): rpc.ReferralOperationStatus {
    return this.referralOperation.status
  }

  get source(): rpc.ReferralOperation_Source {
    return this.referralOperation.source
  }

  get referrerId(): string {
    return this.referralOperation.referrerId
  }

  get amount(): number {
    return this.referralOperation.amount
  }

  get createdAt(): Timestamp {
    return Timestamp.fromDate(this.referralOperation.createdAt)
  }
}

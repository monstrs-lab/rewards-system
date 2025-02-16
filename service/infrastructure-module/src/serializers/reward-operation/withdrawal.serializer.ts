import type { Withdrawal } from '@rewards-system/domain-module'

import { Timestamp }       from '@bufbuild/protobuf'

import * as rpc            from '@rewards-system/rewards-rpc/abstractions'

export class WithdrawalSerializer extends rpc.Withdrawal {
  constructor(private readonly withdrawal: Withdrawal) {
    super()
  }

  get id(): string {
    return this.withdrawal.id
  }

  get ownerId(): string {
    return this.withdrawal.ownerId
  }

  get amount(): number {
    return this.withdrawal.amount?.toNumber()
  }

  get createdAt(): Timestamp {
    return Timestamp.fromDate(this.withdrawal.createdAt)
  }
}

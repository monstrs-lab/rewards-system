import type { Withdrawal }          from '@rewards-system/domain-module'

import { CreateWithdrawalResponse } from '@rewards-system/rewards-rpc/abstractions'

import { WithdrawalSerializer }     from './withdrawal.serializer.js'

export class CreateWithdrawalSerializer extends CreateWithdrawalResponse {
  constructor(private readonly withdrawal: Withdrawal) {
    super()
  }

  get result(): WithdrawalSerializer {
    return new WithdrawalSerializer(this.withdrawal)
  }
}

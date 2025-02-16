import type { Withdrawal }         from '@rewards-system/domain-module'

import { ListWithdrawalsResponse } from '@rewards-system/rewards-rpc/abstractions'

import { WithdrawalSerializer }    from './withdrawal.serializer.js'

export class ListWithdrawalsSerializer extends ListWithdrawalsResponse {
  constructor(private readonly query: { withdrawals: Array<Withdrawal>; hasNextPage: boolean }) {
    super()
  }

  get withdrawals(): Array<WithdrawalSerializer> {
    return this.query.withdrawals.map((withdrawal) => new WithdrawalSerializer(withdrawal))
  }

  get hasNextPage(): boolean {
    return this.query.hasNextPage
  }
}

import type { ReferralOperation }         from '@referral-programs/domain-module'

import { ListReferralOperationsResponse } from '@referral-programs/referral-programs-rpc/abstractions'

import { ReferralOperationSerializer }    from './referral-operation.serializer.js'

export class ListReferralOperationsSerializer extends ListReferralOperationsResponse {
  constructor(
    private readonly query: { referralOperations: Array<ReferralOperation>; hasNextPage: boolean }
  ) {
    super()
  }

  get referralOperations(): Array<ReferralOperationSerializer> {
    return this.query.referralOperations.map(
      (referralOperation) => new ReferralOperationSerializer(referralOperation)
    )
  }

  get hasNextPage(): boolean {
    return this.query.hasNextPage
  }
}

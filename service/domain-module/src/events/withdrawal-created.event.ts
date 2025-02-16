import type { BigNumber } from 'bignumber.js'

export class WithdrawalCreatedEvent {
  constructor(
    public readonly withdrawalId: string,
    public readonly ownerId: string,
    public readonly amount: BigNumber,
    public readonly createdAt: Date
  ) {}
}

import { Guard }                  from '@monstrs/guard-clause'
import { Against }                from '@monstrs/guard-clause'
import { AggregateRoot }          from '@nestjs/cqrs'
import { BigNumber }              from 'bignumber.js'

import { WithdrawalCreatedEvent } from '../events/index.js'

export class Withdrawal extends AggregateRoot {
  #id!: string

  #ownerId!: string

  #amount!: BigNumber

  #createdAt!: Date

  get id(): string {
    return this.#id
  }

  private set id(id: string) {
    this.#id = id
  }

  get ownerId(): string {
    return this.#ownerId
  }

  private set ownerId(ownerId: string) {
    this.#ownerId = ownerId
  }

  get amount(): BigNumber {
    return this.#amount
  }

  private set amount(amount: BigNumber) {
    this.#amount = amount
  }

  get createdAt(): Date {
    return this.#createdAt
  }

  private set createdAt(createdAt: Date) {
    this.#createdAt = createdAt
  }

  @Guard()
  create(
    @Against('id').NotUUID(4) id: string,
    @Against('ownerId').NotUUID(4) ownerId: string,
    @Against('amount').NotInstance(BigNumber) amount: BigNumber
  ): Withdrawal {
    this.apply(new WithdrawalCreatedEvent(id, ownerId, amount, new Date()))

    return this
  }

  protected onWithdrawalCreatedEvent(event: WithdrawalCreatedEvent): void {
    this.id = event.withdrawalId
    this.ownerId = event.ownerId
    this.amount = event.amount
    this.createdAt = event.createdAt
  }
}

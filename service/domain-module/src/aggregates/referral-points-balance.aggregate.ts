import { AggregateRoot }                     from '@nestjs/cqrs'
import { Guard }                             from '@monstrs/guard-clause'
import { Against }                           from '@monstrs/guard-clause'

import { ReferralPointsBalanceCreatedEvent } from '../events/index.js'
import { ReferralPointsBalanceUpdatedEvent } from '../events/index.js'

export class ReferralPointsBalance extends AggregateRoot {
  #id!: string

  #amount: number = 0

  get id(): string {
    return this.#id
  }

  private set id(id: string) {
    this.#id = id
  }

  get amount(): number {
    return this.#amount
  }

  private set amount(amount: number) {
    this.#amount = amount
  }

  @Guard()
  create(@Against('id').NotUUID(4) id: string): ReferralPointsBalance {
    this.apply(new ReferralPointsBalanceCreatedEvent(id))

    return this
  }

  @Guard()
  update(@Against('amount').NotNumberBetween(0, Infinity) amount: number): ReferralPointsBalance {
    this.apply(new ReferralPointsBalanceUpdatedEvent(this.id, amount))

    return this
  }

  protected onReferralPointsBalanceCreatedEvent(event: ReferralPointsBalanceCreatedEvent): void {
    this.id = event.referralPointsBalanceId
  }

  protected onReferralPointsBalanceUpdatedEvent(event: ReferralPointsBalanceUpdatedEvent): void {
    this.amount = event.amount
  }
}

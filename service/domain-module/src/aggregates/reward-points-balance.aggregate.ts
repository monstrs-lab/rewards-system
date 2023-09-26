import { Guard }                           from '@monstrs/guard-clause'
import { Against }                         from '@monstrs/guard-clause'
import { AggregateRoot }                   from '@nestjs/cqrs'

import { RewardPointsBalanceCreatedEvent } from '../events/index.js'
import { RewardPointsBalanceUpdatedEvent } from '../events/index.js'

export class RewardPointsBalance extends AggregateRoot {
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
  create(@Against('id').NotUUID(4) id: string): RewardPointsBalance {
    this.apply(new RewardPointsBalanceCreatedEvent(id))

    return this
  }

  @Guard()
  update(@Against('amount').NotNumberBetween(0, Infinity) amount: number): RewardPointsBalance {
    this.apply(new RewardPointsBalanceUpdatedEvent(this.id, amount))

    return this
  }

  protected onRewardPointsBalanceCreatedEvent(event: RewardPointsBalanceCreatedEvent): void {
    this.id = event.rewardPointsBalanceId
  }

  protected onRewardPointsBalanceUpdatedEvent(event: RewardPointsBalanceUpdatedEvent): void {
    this.amount = event.amount
  }
}

import { AggregateRoot }                  from '@nestjs/cqrs'
import { Guard }                          from '@monstrs/guard-clause'
import { Against }                        from '@monstrs/guard-clause'

import { NotAllowedForConfirmationError } from '../errors/index.js'
import { ReferralProfitConfirmedEvent }   from '../events/index.js'
import { ReferralProfitCreatedEvent }     from '../events/index.js'
import { ReferralOperationStatus }        from '../enums/index.js'

export class ReferralProfit extends AggregateRoot {
  #id!: string

  #operationId!: string

  #agentId!: string

  #referrerId!: string

  #status!: ReferralOperationStatus

  #amount!: number

  #profit!: number

  #percentage!: number

  #level!: number

  #createdAt!: Date

  get id(): string {
    return this.#id
  }

  private set id(id: string) {
    this.#id = id
  }

  get operationId(): string {
    return this.#operationId
  }

  private set operationId(operationId: string) {
    this.#operationId = operationId
  }

  get agentId(): string {
    return this.#agentId
  }

  private set agentId(agentId: string) {
    this.#agentId = agentId
  }

  get referrerId(): string {
    return this.#referrerId
  }

  private set referrerId(referrerId: string) {
    this.#referrerId = referrerId
  }

  get status(): ReferralOperationStatus {
    return this.#status
  }

  private set status(status: ReferralOperationStatus) {
    this.#status = status
  }

  get amount(): number {
    return this.#amount
  }

  private set amount(amount: number) {
    this.#amount = amount
  }

  get profit(): number {
    return this.#profit
  }

  private set profit(profit: number) {
    this.#profit = profit
  }

  get percentage(): number {
    return this.#percentage
  }

  private set percentage(percentage: number) {
    this.#percentage = percentage
  }

  get level(): number {
    return this.#level
  }

  private set level(level: number) {
    this.#level = level
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
    @Against('operationId').NotUUID(4) operationId: string,
    @Against('agentId').NotUUID(4) agentId: string,
    @Against('referrerId').NotUUID(4) referrerId: string,
    @Against('amount').NotNumberBetween(0, Infinity) amount: number,
    @Against('profit').NotNumberBetween(0, Infinity) profit: number,
    @Against('percentage').NotNumberBetween(0, 100) percentage: number,
    @Against('level').NotNumberBetween(0, Infinity)
    level: number
  ): ReferralProfit {
    this.apply(
      new ReferralProfitCreatedEvent(
        id,
        operationId,
        agentId,
        referrerId,
        ReferralOperationStatus.PENDING,
        amount,
        profit,
        percentage,
        level,
        new Date()
      )
    )

    return this
  }

  confirm(): ReferralProfit {
    if (this.status !== ReferralOperationStatus.PENDING) {
      throw new NotAllowedForConfirmationError()
    }

    this.apply(new ReferralProfitConfirmedEvent(this.id))

    return this
  }

  protected onReferralProfitCreatedEvent(event: ReferralProfitCreatedEvent): void {
    this.id = event.referralProfitId
    this.status = event.status
    this.operationId = event.operationId
    this.agentId = event.agentId
    this.referrerId = event.referrerId
    this.amount = event.amount
    this.profit = event.profit
    this.percentage = event.percentage
    this.level = event.level
    this.createdAt = event.createdAt
  }

  protected onReferralProfitConfirmedEvent(): void {
    this.status = ReferralOperationStatus.CONFIRMED
  }
}

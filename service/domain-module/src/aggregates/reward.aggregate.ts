import { Guard }                          from '@monstrs/guard-clause'
import { Against }                        from '@monstrs/guard-clause'
import { AggregateRoot }                  from '@nestjs/cqrs'
import { BigNumber }                      from 'bignumber.js'

import { RewardOperationStatus }          from '../enums/index.js'
import { NotAllowedForConfirmationError } from '../errors/index.js'
import { RewardConfirmedEvent }           from '../events/index.js'
import { RewardCreatedEvent }             from '../events/index.js'

export class Reward extends AggregateRoot {
  #id!: string

  #operationId!: string

  #agentId!: string

  #referrerId!: string

  #status!: RewardOperationStatus

  #amount!: BigNumber

  #profit!: BigNumber

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

  get status(): RewardOperationStatus {
    return this.#status
  }

  private set status(status: RewardOperationStatus) {
    this.#status = status
  }

  get amount(): BigNumber {
    return this.#amount
  }

  private set amount(amount: BigNumber) {
    this.#amount = amount
  }

  get profit(): BigNumber {
    return this.#profit
  }

  private set profit(profit: BigNumber) {
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
    @Against('amount').NotInstance(BigNumber) amount: BigNumber,
    @Against('profit').NotInstance(BigNumber) profit: BigNumber,
    @Against('percentage').NotNumberBetween(0, 100) percentage: number,
    @Against('level').NotNumberBetween(0, Infinity)
    level: number
  ): Reward {
    this.apply(
      new RewardCreatedEvent(
        id,
        operationId,
        agentId,
        referrerId,
        RewardOperationStatus.PENDING,
        amount,
        profit,
        percentage,
        level,
        new Date()
      )
    )

    return this
  }

  confirm(): Reward {
    if (this.status !== RewardOperationStatus.PENDING) {
      throw new NotAllowedForConfirmationError()
    }

    this.apply(new RewardConfirmedEvent(this.id))

    return this
  }

  protected onRewardCreatedEvent(event: RewardCreatedEvent): void {
    this.id = event.rewardId
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

  protected onRewardConfirmedEvent(): void {
    this.status = RewardOperationStatus.CONFIRMED
  }
}

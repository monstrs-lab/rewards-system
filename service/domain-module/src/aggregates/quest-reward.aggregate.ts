import { Guard }                          from '@monstrs/guard-clause'
import { Against }                        from '@monstrs/guard-clause'
import { AggregateRoot }                  from '@nestjs/cqrs'
import { BigNumber }                      from 'bignumber.js'

import { QuestRewardSource }              from '../entities/index.js'
import { RewardOperationStatus }          from '../enums/index.js'
import { NotAllowedForConfirmationError } from '../errors/index.js'
import { QuestRewardConfirmedEvent }      from '../events/index.js'
import { QuestRewardCreatedEvent }        from '../events/index.js'

export class QuestReward extends AggregateRoot {
  #id!: string

  #recipientId!: string

  #status!: RewardOperationStatus

  #source!: QuestRewardSource

  #amount!: BigNumber

  #createdAt!: Date

  get id(): string {
    return this.#id
  }

  private set id(id: string) {
    this.#id = id
  }

  get recipientId(): string {
    return this.#recipientId
  }

  private set recipientId(recipientId: string) {
    this.#recipientId = recipientId
  }

  get status(): RewardOperationStatus {
    return this.#status
  }

  private set status(status: RewardOperationStatus) {
    this.#status = status
  }

  get source(): QuestRewardSource {
    return this.#source
  }

  private set source(source: QuestRewardSource) {
    this.#source = source
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
    @Against('recipientId').NotUUID(4) recipientId: string,
    @Against('source').NotInstance(QuestRewardSource) source: QuestRewardSource,
    @Against('amount').NotInstance(BigNumber) amount: BigNumber
  ): QuestReward {
    this.apply(
      new QuestRewardCreatedEvent(
        id,
        recipientId,
        RewardOperationStatus.PENDING,
        source,
        amount,
        new Date()
      )
    )

    return this
  }

  confirm(): QuestReward {
    if (this.status !== RewardOperationStatus.PENDING) {
      throw new NotAllowedForConfirmationError()
    }

    this.apply(new QuestRewardConfirmedEvent(this.id))

    return this
  }

  protected onQuestRewardCreatedEvent(event: QuestRewardCreatedEvent): void {
    this.id = event.questRewardId
    this.status = event.status
    this.recipientId = event.recipientId
    this.source = event.source
    this.amount = event.amount
    this.createdAt = event.createdAt
  }

  protected onQuestRewardConfirmedEvent(): void {
    this.status = RewardOperationStatus.CONFIRMED
  }
}

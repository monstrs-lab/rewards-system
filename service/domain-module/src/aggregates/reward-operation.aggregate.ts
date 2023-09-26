import { Guard }                          from '@monstrs/guard-clause'
import { Against }                        from '@monstrs/guard-clause'
import { AggregateRoot }                  from '@nestjs/cqrs'
import { BigNumber }                      from 'bignumber.js'

import { RewardOperationSource }          from '../entities/index.js'
import { RewardOperationStatus }          from '../enums/index.js'
import { NotAllowedForConfirmationError } from '../errors/index.js'
import { RewardOperationConfirmedEvent }  from '../events/index.js'
import { RewardOperationCreatedEvent }    from '../events/index.js'

export class RewardOperation extends AggregateRoot {
  #id!: string

  #rewardProgramId!: string

  #referrerId!: string

  #status!: RewardOperationStatus

  #source!: RewardOperationSource

  #amount!: BigNumber

  #createdAt!: Date

  get id(): string {
    return this.#id
  }

  private set id(id: string) {
    this.#id = id
  }

  get rewardProgramId(): string {
    return this.#rewardProgramId
  }

  private set rewardProgramId(rewardProgramId: string) {
    this.#rewardProgramId = rewardProgramId
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

  get source(): RewardOperationSource {
    return this.#source
  }

  private set source(source: RewardOperationSource) {
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
    @Against('RewardProgramId').Empty() RewardProgramId: string,
    @Against('referrerId').NotUUID(4) referrerId: string,
    @Against('source').NotInstance(RewardOperationSource) source: RewardOperationSource,
    @Against('amount').NotInstance(BigNumber) amount: BigNumber
  ): RewardOperation {
    this.apply(
      new RewardOperationCreatedEvent(
        id,
        RewardProgramId,
        referrerId,
        RewardOperationStatus.PENDING,
        source,
        amount,
        new Date()
      )
    )

    return this
  }

  confirm(): RewardOperation {
    if (this.status !== RewardOperationStatus.PENDING) {
      throw new NotAllowedForConfirmationError()
    }

    this.apply(new RewardOperationConfirmedEvent(this.id))

    return this
  }

  protected onRewardOperationCreatedEvent(event: RewardOperationCreatedEvent): void {
    this.id = event.rewardOperationId
    this.rewardProgramId = event.rewardProgramId
    this.referrerId = event.referrerId
    this.status = event.status
    this.source = event.source
    this.amount = event.amount
    this.createdAt = event.createdAt
  }

  protected onRewardOperationConfirmedEvent(): void {
    this.status = RewardOperationStatus.CONFIRMED
  }
}

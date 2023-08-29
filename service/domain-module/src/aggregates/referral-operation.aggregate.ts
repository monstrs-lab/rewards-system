import { AggregateRoot }                   from '@nestjs/cqrs'
import { Guard }                           from '@monstrs/guard-clause'
import { Against }                         from '@monstrs/guard-clause'

import { ReferralOperationSource }         from '../entities/index.js'
import { ReferralOperationConfirmedEvent } from '../events/index.js'
import { ReferralOperationCreatedEvent }   from '../events/index.js'
import { ReferralOperationStatus }         from '../enums/index.js'
import { NotAllowedForConfirmationError }  from '../errors/index.js'

export class ReferralOperation extends AggregateRoot {
  #id!: string

  #referralProgramId!: string

  #referrerId!: string

  #status!: ReferralOperationStatus

  #source!: ReferralOperationSource

  #amount!: number

  #createdAt!: Date

  get id(): string {
    return this.#id
  }

  private set id(id: string) {
    this.#id = id
  }

  get referralProgramId(): string {
    return this.#referralProgramId
  }

  private set referralProgramId(referralProgramId: string) {
    this.#referralProgramId = referralProgramId
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

  get source(): ReferralOperationSource {
    return this.#source
  }

  private set source(source: ReferralOperationSource) {
    this.#source = source
  }

  get amount(): number {
    return this.#amount
  }

  private set amount(amount: number) {
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
    @Against('referralProgramId').Empty() referralProgramId: string,
    @Against('referrerId').NotUUID(4) referrerId: string,
    @Against('source').NotInstance(ReferralOperationSource) source: ReferralOperationSource,
    @Against('amount').NotNumberBetween(0, Infinity) amount: number
  ): ReferralOperation {
    this.apply(
      new ReferralOperationCreatedEvent(
        id,
        referralProgramId,
        referrerId,
        ReferralOperationStatus.PENDING,
        source,
        amount,
        new Date()
      )
    )

    return this
  }

  confirm(): ReferralOperation {
    if (this.status !== ReferralOperationStatus.PENDING) {
      throw new NotAllowedForConfirmationError()
    }

    this.apply(new ReferralOperationConfirmedEvent(this.id))

    return this
  }

  protected onReferralOperationCreatedEvent(event: ReferralOperationCreatedEvent): void {
    this.id = event.referralOperationId
    this.referralProgramId = event.referralProgramId
    this.referrerId = event.referrerId
    this.status = event.status
    this.source = event.source
    this.amount = event.amount
    this.createdAt = event.createdAt
  }

  protected onReferralOperationConfirmedEvent(): void {
    this.status = ReferralOperationStatus.CONFIRMED
  }
}

import { AggregateRoot }                   from '@nestjs/cqrs'
import { Guard }                           from '@monstrs/guard-clause'
import { Against }                         from '@monstrs/guard-clause'
import { customAlphabet }                  from 'nanoid'

import { ReferralAgentCreatedEvent }       from '../events/index.js'
import { ReferralAgentMetadataAddedEvent } from '../events/index.js'

export class ReferralAgent extends AggregateRoot {
  #id!: string

  #code!: string

  #parentId?: string

  #metadata!: Record<string, any>

  get id(): string {
    return this.#id
  }

  private set id(id: string) {
    this.#id = id
  }

  get code(): string {
    return this.#code
  }

  private set code(code: string) {
    this.#code = code
  }

  get metadata(): Record<string, any> {
    return this.#metadata
  }

  private set metadata(metadata: Record<string, any>) {
    this.#metadata = metadata
  }

  get parentId(): string | undefined {
    return this.#parentId
  }

  private set parentId(parentId: string | undefined) {
    this.#parentId = parentId
  }

  @Guard()
  create(
    @Against('id').NotUUID(4) id: string,
    @Against('parentId').Optional.NotUUID(4) parentId?: string
  ): ReferralAgent {
    this.apply(
      new ReferralAgentCreatedEvent(
        id,
        customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 24)(),
        parentId
      )
    )

    return this
  }

  @Guard()
  addMetadata(@Against('metadata').Empty() metadata: Record<string, any>): ReferralAgent {
    this.apply(new ReferralAgentMetadataAddedEvent(this.id, metadata))

    return this
  }

  protected onReferralAgentCreatedEvent(event: ReferralAgentCreatedEvent): void {
    this.id = event.referralAgentId
    this.parentId = event.parentId
    this.code = event.code
    this.metadata = {}
  }

  protected onReferralAgentMetadataAddedEvent(event: ReferralAgentMetadataAddedEvent): void {
    this.metadata = {
      ...this.metadata,
      ...event.metadata,
    }
  }
}

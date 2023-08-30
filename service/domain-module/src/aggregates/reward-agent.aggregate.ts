import { AggregateRoot }                 from '@nestjs/cqrs'
import { Guard }                         from '@monstrs/guard-clause'
import { Against }                       from '@monstrs/guard-clause'
import { customAlphabet }                from 'nanoid'

import { RewardAgentCreatedEvent }       from '../events/index.js'
import { RewardAgentMetadataAddedEvent } from '../events/index.js'

export class RewardAgent extends AggregateRoot {
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
  ): RewardAgent {
    this.apply(
      new RewardAgentCreatedEvent(
        id,
        customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 24)(),
        parentId
      )
    )

    return this
  }

  @Guard()
  addMetadata(@Against('metadata').Empty() metadata: Record<string, any>): RewardAgent {
    this.apply(new RewardAgentMetadataAddedEvent(this.id, metadata))

    return this
  }

  protected onRewardAgentCreatedEvent(event: RewardAgentCreatedEvent): void {
    this.id = event.rewardAgentId
    this.parentId = event.parentId
    this.code = event.code
    this.metadata = {}
  }

  protected onRewardAgentMetadataAddedEvent(event: RewardAgentMetadataAddedEvent): void {
    this.metadata = {
      ...this.metadata,
      ...event.metadata,
    }
  }
}

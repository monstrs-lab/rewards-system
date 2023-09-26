import { Guard }                   from '@monstrs/guard-clause'
import { Against }                 from '@monstrs/guard-clause'

import { RewardProgramConditions } from '../value-objects/index.js'
import { RewardProgramField }      from '../value-objects/index.js'

export class RewardProgramRule {
  #id!: string

  #name!: string

  #order!: number

  #conditions!: RewardProgramConditions

  #fields!: Array<RewardProgramField>

  get id(): string {
    return this.#id
  }

  private set id(id: string) {
    this.#id = id
  }

  get name(): string {
    return this.#name
  }

  private set name(name: string) {
    this.#name = name
  }

  get order(): number {
    return this.#order
  }

  private set order(order: number) {
    this.#order = order
  }

  get conditions(): RewardProgramConditions {
    return this.#conditions
  }

  private set conditions(conditions: RewardProgramConditions) {
    this.#conditions = conditions
  }

  get fields(): Array<RewardProgramField> {
    return this.#fields
  }

  private set fields(fields: Array<RewardProgramField>) {
    this.#fields = fields
  }

  @Guard()
  static create(
    @Against('id').NotUUID(4) id: string,
    @Against('name').Empty() name: string,
    @Against('order').NotNumberBetween(0, Infinity) order: number,
    @Against('conditions').NotInstance(RewardProgramConditions)
    conditions: RewardProgramConditions,
    @Against('fields').Each.NotInstance(RewardProgramField)
    fields: Array<RewardProgramField>
  ): RewardProgramRule {
    const rewardProgramRule = new RewardProgramRule()

    rewardProgramRule.id = id
    rewardProgramRule.name = name
    rewardProgramRule.order = order
    rewardProgramRule.conditions = conditions
    rewardProgramRule.fields = fields

    return rewardProgramRule
  }
}

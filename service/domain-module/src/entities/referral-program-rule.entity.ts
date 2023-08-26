import { Guard }                     from '@monstrs/guard-clause'
import { Against }                   from '@monstrs/guard-clause'

import { ReferralProgramConditions } from '../value-objects/index.js'
import { ReferralProgramField }      from '../value-objects/index.js'

export class ReferralProgramRule {
  #id!: string

  #name!: string

  #order!: number

  #conditions!: ReferralProgramConditions

  #fields!: Array<ReferralProgramField>

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

  get conditions(): ReferralProgramConditions {
    return this.#conditions
  }

  private set conditions(conditions: ReferralProgramConditions) {
    this.#conditions = conditions
  }

  get fields(): Array<ReferralProgramField> {
    return this.#fields
  }

  private set fields(fields: Array<ReferralProgramField>) {
    this.#fields = fields
  }

  @Guard()
  static create(
    @Against('id').NotUUID(4) id: string,
    @Against('name').Empty() name: string,
    @Against('order').NotNumberBetween(0, Infinity) order: number,
    @Against('conditions').NotInstance(ReferralProgramConditions)
    conditions: ReferralProgramConditions,
    @Against('fields').Each.NotInstance(ReferralProgramField)
    fields: Array<ReferralProgramField>
  ): ReferralProgramRule {
    const referralProgramRule = new ReferralProgramRule()

    referralProgramRule.id = id
    referralProgramRule.name = name
    referralProgramRule.order = order
    referralProgramRule.conditions = conditions
    referralProgramRule.fields = fields

    return referralProgramRule
  }
}

import { AggregateRoot }               from '@nestjs/cqrs'
import { Guard }                       from '@monstrs/guard-clause'
import { Against }                     from '@monstrs/guard-clause'

import { ReferralProgramRule }         from '../entities/index.js'
import { ReferralProgramCreatedEvent } from '../events/index.js'
import { ReferralProgramUpdatedEvent } from '../events/index.js'

export class ReferralProgram extends AggregateRoot {
  #id!: string

  #name!: string

  #code!: string

  #percentage!: number

  #rules: Array<ReferralProgramRule> = []

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

  get code(): string {
    return this.#code
  }

  private set code(code: string) {
    this.#code = code
  }

  get percentage(): number {
    return this.#percentage
  }

  private set percentage(percentage: number) {
    this.#percentage = percentage
  }

  get rules(): Array<ReferralProgramRule> {
    return this.#rules
  }

  private set rules(rules: Array<ReferralProgramRule>) {
    this.#rules = rules
  }

  @Guard()
  create(
    @Against('id').NotUUID(4) id: string,
    @Against('name').Empty() name: string,
    @Against('code').Empty() code: string,
    @Against('percentage').NotNumberBetween(0, 100) percentage: number
  ): ReferralProgram {
    this.apply(new ReferralProgramCreatedEvent(id, name, code, percentage))

    return this
  }

  @Guard()
  update(
    @Against('name').Empty() name: string,
    @Against('percentage').NotNumberBetween(0, 100) percentage: number
  ): ReferralProgram {
    this.apply(new ReferralProgramUpdatedEvent(this.id, name, percentage))

    return this
  }

  @Guard()
  addRule(
    @Against('rule').NotInstance(ReferralProgramRule) rule: ReferralProgramRule
  ): ReferralProgram {
    this.rules.push(rule)

    return this
  }

  @Guard()
  updateRule(
    @Against('rule').NotInstance(ReferralProgramRule) rule: ReferralProgramRule
  ): ReferralProgram {
    this.rules = this.rules.map((r) => {
      if (r.id === rule.id) {
        return rule
      }

      return r
    })

    return this
  }

  @Guard()
  deleteRule(@Against('id').NotUUID(4) id: string): ReferralProgram {
    this.rules = this.rules.filter((rule) => rule.id !== id)

    return this
  }

  protected onReferralProgramCreatedEvent(event: ReferralProgramCreatedEvent): void {
    this.id = event.referralProgramId
    this.name = event.name
    this.code = event.code
    this.percentage = event.percentage
  }

  protected onReferralProgramUpdatedEvent(event: ReferralProgramUpdatedEvent): void {
    this.name = event.name
    this.percentage = event.percentage
  }
}

import { AggregateRoot }             from '@nestjs/cqrs'
import { Guard }                     from '@monstrs/guard-clause'
import { Against }                   from '@monstrs/guard-clause'
import { v4 as uuid }                from 'uuid'

import { RewardProgramRule }         from '../entities/index.js'
import { RewardProgramCreatedEvent } from '../events/index.js'
import { RewardProgramUpdatedEvent } from '../events/index.js'
import { RewardOperation }           from './reward-operation.aggregate.js'
import { RewardAgent }               from './reward-agent.aggregate.js'
import { Reward }                    from './reward.aggregate.js'

export class RewardProgram extends AggregateRoot {
  #id!: string

  #name!: string

  #code!: string

  #percentage!: number

  #rules: Array<RewardProgramRule> = []

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

  get rules(): Array<RewardProgramRule> {
    return this.#rules
  }

  private set rules(rules: Array<RewardProgramRule>) {
    this.#rules = rules
  }

  @Guard()
  create(
    @Against('id').NotUUID(4) id: string,
    @Against('name').Empty() name: string,
    @Against('code').Empty() code: string,
    @Against('percentage').NotNumberBetween(0, 100) percentage: number
  ): RewardProgram {
    this.apply(new RewardProgramCreatedEvent(id, name, code, percentage))

    return this
  }

  @Guard()
  update(
    @Against('name').Empty() name: string,
    @Against('percentage').NotNumberBetween(0, 100) percentage: number
  ): RewardProgram {
    this.apply(new RewardProgramUpdatedEvent(this.id, name, percentage))

    return this
  }

  @Guard()
  addRule(@Against('rule').NotInstance(RewardProgramRule) rule: RewardProgramRule): RewardProgram {
    this.rules.push(rule)

    return this
  }

  @Guard()
  updateRule(
    @Against('rule').NotInstance(RewardProgramRule) rule: RewardProgramRule
  ): RewardProgram {
    this.rules = this.rules.map((r) => {
      if (r.id === rule.id) {
        return rule
      }

      return r
    })

    return this
  }

  @Guard()
  deleteRule(@Against('id').NotUUID(4) id: string): RewardProgram {
    this.rules = this.rules.filter((rule) => rule.id !== id)

    return this
  }

  @Guard()
  async calculate(
    @Against('operation').NotInstance(RewardOperation) operation: RewardOperation,
    @Against('referrer').NotInstance(RewardAgent) referrer: RewardAgent,
    @Against('recipients').Each.NotInstance(RewardAgent) recipients: Array<RewardAgent>
  ): Promise<Array<Reward>> {
    const profits: Array<Reward> = []

    for await (const rule of this.rules.sort((a, b) => a.order - b.order)) {
      if (await rule.conditions.match(referrer.metadata)) {
        const amount = operation.amount * (this.percentage / 100)

        for await (const field of rule.fields) {
          const index = rule.fields.indexOf(field)
          const recipient = recipients.at(index)

          if (recipient) {
            if (await field.conditions.match(recipient.metadata)) {
              profits.push(
                new Reward().create(
                  uuid(),
                  operation.id,
                  recipient.id,
                  referrer.id,
                  amount,
                  amount * (field.percentage / 100),
                  field.percentage,
                  index + 1
                )
              )
            }
          }
        }
      }
    }

    return profits
  }

  protected onRewardProgramCreatedEvent(event: RewardProgramCreatedEvent): void {
    this.id = event.rewardProgramId
    this.name = event.name
    this.code = event.code
    this.percentage = event.percentage
  }

  protected onRewardProgramUpdatedEvent(event: RewardProgramUpdatedEvent): void {
    this.name = event.name
    this.percentage = event.percentage
  }
}

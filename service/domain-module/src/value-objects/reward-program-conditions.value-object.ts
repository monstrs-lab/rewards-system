import type { TopLevelCondition } from 'json-rules-engine'

import { Guard }                  from '@monstrs/guard-clause'
import { Against }                from '@monstrs/guard-clause'
import { Engine }                 from 'json-rules-engine'

import { jsonRulesEngineSchema }  from '../schemas/index.js'

export class RewardProgramConditions {
  #conditions!: TopLevelCondition

  get conditions(): TopLevelCondition {
    return this.#conditions
  }

  private set conditions(conditions: TopLevelCondition) {
    this.#conditions = conditions
  }

  @Guard()
  static create(
    @Against('conditions').NotJsonSchemaValid(jsonRulesEngineSchema.schema, [
      jsonRulesEngineSchema.defs,
    ])
    conditions: TopLevelCondition
  ): RewardProgramConditions {
    const rewardProgramConditions = new RewardProgramConditions()

    rewardProgramConditions.conditions = conditions

    return rewardProgramConditions
  }

  async match(facts: Record<string, any>): Promise<boolean> {
    const engine = new Engine(
      [
        {
          conditions: this.conditions,
          event: {
            type: 'matched',
          },
        },
      ],
      {
        allowUndefinedFacts: true,
      }
    )

    const { events } = await engine.run(facts)

    return events.length > 0
  }
}

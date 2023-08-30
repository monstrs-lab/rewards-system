/* eslint-disable no-param-reassign */

import type { ExtractProperties }   from '@monstrs/base-types'
import type { RewardProgram }       from '@rewards-system/domain-module'

import type { RewardProgramEntity } from '../entities/index.js'

import { Injectable }               from '@nestjs/common'

import { RewardProgramFactory }     from '@rewards-system/domain-module'
import { RewardProgramConditions }  from '@rewards-system/domain-module'
import { RewardProgramField }       from '@rewards-system/domain-module'
import { RewardProgramRule }        from '@rewards-system/domain-module'

import { RewardProgramRuleEntity }  from '../entities/index.js'

@Injectable()
export class RewardProgramMapper {
  constructor(private readonly factory: RewardProgramFactory) {}

  toDomain(entity: RewardProgramEntity): RewardProgram {
    const properties: Omit<ExtractProperties<RewardProgram>, 'autoCommit'> = {
      id: entity.id,
      name: entity.name,
      code: entity.code,
      percentage: entity.percentage,
      rules: entity.rules.getItems().map((ruleEntity) => {
        const conditionProperties: ExtractProperties<RewardProgramConditions> = {
          conditions: ruleEntity.conditions,
        }

        const ruleProperties: ExtractProperties<RewardProgramRule> = {
          id: ruleEntity.id,
          name: ruleEntity.name,
          order: ruleEntity.order,
          conditions: Object.assign(new RewardProgramConditions(), conditionProperties),
          fields: ruleEntity.fields.map((fieldEntity) => {
            const fieldConditionProperties: ExtractProperties<RewardProgramConditions> = {
              conditions: fieldEntity.conditions,
            }

            const fieldProperties: ExtractProperties<RewardProgramField> = {
              percentage: fieldEntity.percentage,
              conditions: Object.assign(new RewardProgramConditions(), fieldConditionProperties),
            }

            return Object.assign(new RewardProgramField(), fieldProperties)
          }),
        }

        return Object.assign(new RewardProgramRule(), ruleProperties)
      }),
    }

    return Object.assign(this.factory.create(), properties)
  }

  toPersistence(aggregate: RewardProgram, entity: RewardProgramEntity): RewardProgramEntity {
    entity.assign({
      id: aggregate.id,
      name: aggregate.name,
      code: aggregate.code,
      percentage: aggregate.percentage,
    })

    aggregate.rules.forEach((rule) => {
      if (entity.rules.getIdentifiers('id').includes(rule.id)) {
        entity.rules.getItems().forEach((ruleEntity) => {
          if (rule.id === ruleEntity.id) {
            ruleEntity.assign({
              id: rule.id,
              name: rule.name,
              order: rule.order,
              conditions: rule.conditions.conditions,
              fields: rule.fields.map((field) => ({
                percentage: field.percentage,
                conditions: field.conditions.conditions,
              })),
            })

            ruleEntity.conditions = rule.conditions.conditions
          }
        })
      } else {
        const ruleEntity = new RewardProgramRuleEntity()

        ruleEntity.assign({
          id: rule.id,
          name: rule.name,
          order: rule.order,
          conditions: rule.conditions.conditions,
          fields: rule.fields.map((field) => ({
            percentage: field.percentage,
            conditions: field.conditions.conditions,
          })),
        })

        entity.rules.add(ruleEntity)
      }
    })

    entity.rules.getItems().forEach((ruleEntity) => {
      if (!aggregate.rules.find((rule) => rule.id === ruleEntity.id)) {
        entity.rules.remove(ruleEntity)
      }
    })

    return entity
  }
}

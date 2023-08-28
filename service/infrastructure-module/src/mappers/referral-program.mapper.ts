/* eslint-disable no-param-reassign */

import type { ExtractProperties }     from '@monstrs/base-types'
import type { ReferralProgram }       from '@referral-programs/domain-module'

import type { ReferralProgramEntity } from '../entities/index.js'

import { Injectable }                 from '@nestjs/common'

import { ReferralProgramFactory }     from '@referral-programs/domain-module'
import { ReferralProgramConditions }  from '@referral-programs/domain-module'
import { ReferralProgramField }       from '@referral-programs/domain-module'
import { ReferralProgramRule }        from '@referral-programs/domain-module'

import { ReferralProgramRuleEntity }  from '../entities/index.js'

@Injectable()
export class ReferralProgramMapper {
  constructor(private readonly factory: ReferralProgramFactory) {}

  toDomain(entity: ReferralProgramEntity): ReferralProgram {
    const properties: Omit<ExtractProperties<ReferralProgram>, 'autoCommit'> = {
      id: entity.id,
      name: entity.name,
      code: entity.code,
      percentage: entity.percentage,
      rules: entity.rules.getItems().map((ruleEntity) => {
        const conditionProperties: ExtractProperties<ReferralProgramConditions> = {
          conditions: ruleEntity.conditions,
        }

        const ruleProperties: ExtractProperties<ReferralProgramRule> = {
          id: ruleEntity.id,
          name: ruleEntity.name,
          order: ruleEntity.order,
          conditions: Object.assign(new ReferralProgramConditions(), conditionProperties),
          fields: ruleEntity.fields.map((fieldEntity) => {
            const fieldConditionProperties: ExtractProperties<ReferralProgramConditions> = {
              conditions: fieldEntity.conditions,
            }

            const fieldProperties: ExtractProperties<ReferralProgramField> = {
              percentage: fieldEntity.percentage,
              conditions: Object.assign(new ReferralProgramConditions(), fieldConditionProperties),
            }

            return Object.assign(new ReferralProgramField(), fieldProperties)
          }),
        }

        return Object.assign(new ReferralProgramRule(), ruleProperties)
      }),
    }

    return Object.assign(this.factory.create(), properties)
  }

  toPersistence(aggregate: ReferralProgram, entity: ReferralProgramEntity): ReferralProgramEntity {
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
        const ruleEntity = new ReferralProgramRuleEntity()

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

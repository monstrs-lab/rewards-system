/* eslint-disable max-classes-per-file */

import type { RewardProgram }      from '@rewards-system/domain-module'
import type { RewardProgramField } from '@rewards-system/domain-module'
import type { RewardProgramRule }  from '@rewards-system/domain-module'
import type { JsonValue }          from '@bufbuild/protobuf'

import { Struct }                  from '@bufbuild/protobuf'

import * as rpc                    from '@rewards-system/rewards-rpc/abstractions'

export class RewardProgramFieldSerializer extends rpc.RewardProgramField {
  constructor(private readonly rewardProgramField: RewardProgramField) {
    super()
  }

  get percentage(): number {
    return this.rewardProgramField.percentage
  }

  get conditions(): Struct {
    return Struct.fromJson(this.rewardProgramField.conditions.conditions as JsonValue)
  }
}

export class RewardProgramRuleSerializer extends rpc.RewardProgramRule {
  constructor(private readonly rewardProgramRule: RewardProgramRule) {
    super()
  }

  get id(): string {
    return this.rewardProgramRule.id
  }

  get name(): string {
    return this.rewardProgramRule.name
  }

  get order(): number {
    return this.rewardProgramRule.order
  }

  get conditions(): Struct {
    return Struct.fromJson(this.rewardProgramRule.conditions.conditions as JsonValue)
  }

  get fields(): Array<rpc.RewardProgramField> {
    return this.rewardProgramRule.fields.map((field) => new RewardProgramFieldSerializer(field))
  }
}

export class RewardProgramSerializer extends rpc.RewardProgram {
  constructor(private readonly rewardProgram: RewardProgram) {
    super()
  }

  get id(): string {
    return this.rewardProgram.id
  }

  get name(): string {
    return this.rewardProgram.name
  }

  get code(): string {
    return this.rewardProgram.code
  }

  get percentage(): number {
    return this.rewardProgram.percentage
  }

  get rules(): Array<RewardProgramRuleSerializer> {
    return this.rewardProgram.rules.map((rule) => new RewardProgramRuleSerializer(rule))
  }
}

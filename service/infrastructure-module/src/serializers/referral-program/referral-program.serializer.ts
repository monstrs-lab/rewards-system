/* eslint-disable max-classes-per-file */

import type { ReferralProgram }      from '@referral-programs/domain-module'
import type { ReferralProgramField } from '@referral-programs/domain-module'
import type { ReferralProgramRule }  from '@referral-programs/domain-module'
import type { JsonValue }            from '@referral-programs/referral-programs-rpc'

import * as rpc                      from '@referral-programs/referral-programs-rpc/abstractions'
import { Struct }                    from '@referral-programs/referral-programs-rpc'

export class ReferralProgramFieldSerializer extends rpc.ReferralProgramField {
  constructor(private readonly referralProgramField: ReferralProgramField) {
    super()
  }

  get percentage(): number {
    return this.referralProgramField.percentage
  }

  get conditions(): Struct {
    return Struct.fromJson(this.referralProgramField.conditions.conditions as JsonValue)
  }
}

export class ReferralProgramRuleSerializer extends rpc.ReferralProgramRule {
  constructor(private readonly referralProgramRule: ReferralProgramRule) {
    super()
  }

  get id(): string {
    return this.referralProgramRule.id
  }

  get name(): string {
    return this.referralProgramRule.name
  }

  get order(): number {
    return this.referralProgramRule.order
  }

  get conditions(): Struct {
    return Struct.fromJson(this.referralProgramRule.conditions.conditions as JsonValue)
  }

  get fields(): Array<rpc.ReferralProgramField> {
    return this.referralProgramRule.fields.map((field) => new ReferralProgramFieldSerializer(field))
  }
}

export class ReferralProgramSerializer extends rpc.ReferralProgram {
  constructor(private readonly referralProgram: ReferralProgram) {
    super()
  }

  get id(): string {
    return this.referralProgram.id
  }

  get name(): string {
    return this.referralProgram.name
  }

  get code(): string {
    return this.referralProgram.code
  }

  get percentage(): number {
    return this.referralProgram.percentage
  }

  get rules(): Array<ReferralProgramRuleSerializer> {
    return this.referralProgram.rules.map((rule) => new ReferralProgramRuleSerializer(rule))
  }
}

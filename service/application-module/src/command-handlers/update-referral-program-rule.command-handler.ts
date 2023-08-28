import type { ICommandHandler }             from '@nestjs/cqrs'

import assert                               from 'node:assert'

import { CommandHandler }                   from '@nestjs/cqrs'

import { ReferralProgramRepository }        from '@referral-programs/domain-module'
import { ReferralProgramConditions }        from '@referral-programs/domain-module'
import { ReferralProgramField }             from '@referral-programs/domain-module'
import { ReferralProgramRule }              from '@referral-programs/domain-module'

import { UpdateReferralProgramRuleCommand } from '../commands/index.js'

@CommandHandler(UpdateReferralProgramRuleCommand)
export class UpdateReferralProgramRuleCommandHandler
  implements ICommandHandler<UpdateReferralProgramRuleCommand, void>
{
  constructor(private readonly referralProgramRepository: ReferralProgramRepository) {}

  async execute(command: UpdateReferralProgramRuleCommand): Promise<void> {
    const referralProgram = await this.referralProgramRepository.findById(command.referralProgramId)

    assert.ok(referralProgram, `Referral program with id '${command.referralProgramId}' not found`)

    assert.ok(
      referralProgram.rules.find((rule) => rule.id === command.referralProgramRuleId),
      `Referral program rule with id '${command.referralProgramRuleId}' not found`
    )

    await this.referralProgramRepository.save(
      referralProgram.updateRule(
        ReferralProgramRule.create(
          command.referralProgramRuleId,
          command.name,
          command.order,
          ReferralProgramConditions.create(command.conditions),
          command.fields.map((field) =>
            ReferralProgramField.create(
              field.percentage,
              ReferralProgramConditions.create(field.conditions)
            ))
        )
      )
    )
  }
}

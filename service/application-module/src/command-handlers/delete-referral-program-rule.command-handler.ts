import type { ICommandHandler }             from '@nestjs/cqrs'

import assert                               from 'node:assert'

import { CommandHandler }                   from '@nestjs/cqrs'

import { ReferralProgramRepository }        from '@referral-programs/domain-module'

import { DeleteReferralProgramRuleCommand } from '../commands/index.js'

@CommandHandler(DeleteReferralProgramRuleCommand)
export class DeleteReferralProgramRuleCommandHandler
  implements ICommandHandler<DeleteReferralProgramRuleCommand, void>
{
  constructor(private readonly referralProgramRepository: ReferralProgramRepository) {}

  async execute(command: DeleteReferralProgramRuleCommand): Promise<void> {
    const referralProgram = await this.referralProgramRepository.findById(command.referralProgramId)

    assert.ok(referralProgram, `Referral program with id '${command.referralProgramId}' not found`)
    assert.ok(
      referralProgram.rules.find((rule) => rule.id === command.referralProgramRuleId),
      `Referral program rule with id '${command.referralProgramRuleId}' not found`
    )

    await this.referralProgramRepository.save(
      referralProgram.deleteRule(command.referralProgramRuleId)
    )
  }
}

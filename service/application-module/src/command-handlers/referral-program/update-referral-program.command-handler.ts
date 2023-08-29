import type { ICommandHandler }         from '@nestjs/cqrs'

import assert                           from 'node:assert'

import { CommandHandler }               from '@nestjs/cqrs'

import { ReferralProgramRepository }    from '@referral-programs/domain-module'

import { UpdateReferralProgramCommand } from '../../commands/index.js'

@CommandHandler(UpdateReferralProgramCommand)
export class UpdateReferralProgramCommandHandler
  implements ICommandHandler<UpdateReferralProgramCommand, void>
{
  constructor(private readonly referralProgramRepository: ReferralProgramRepository) {}

  async execute(command: UpdateReferralProgramCommand): Promise<void> {
    const referralProgram = await this.referralProgramRepository.findById(command.referralProgramId)

    assert.ok(referralProgram, `Referral program with id '${command.referralProgramId}' not found`)

    await this.referralProgramRepository.save(
      referralProgram.update(command.name, command.percentage)
    )
  }
}

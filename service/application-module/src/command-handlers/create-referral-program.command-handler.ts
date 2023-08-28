import type { ICommandHandler }         from '@nestjs/cqrs'

import assert                           from 'node:assert'

import { CommandHandler }               from '@nestjs/cqrs'

import { ReferralProgramFactory }       from '@referral-programs/domain-module'
import { ReferralProgramRepository }    from '@referral-programs/domain-module'

import { CreateReferralProgramCommand } from '../commands/index.js'

@CommandHandler(CreateReferralProgramCommand)
export class CreateReferralProgramCommandHandler
  implements ICommandHandler<CreateReferralProgramCommand, void>
{
  constructor(
    private readonly referralProgramRepository: ReferralProgramRepository,
    private readonly referralProgramFactory: ReferralProgramFactory
  ) {}

  async execute(command: CreateReferralProgramCommand): Promise<void> {
    const exists = await this.referralProgramRepository.findByCode(command.code)

    assert.ok(!exists, `Referral program with code '${command.code}' already exists.`)

    await this.referralProgramRepository.save(
      this.referralProgramFactory
        .create()
        .create(command.id, command.name, command.code, command.percentage)
    )
  }
}

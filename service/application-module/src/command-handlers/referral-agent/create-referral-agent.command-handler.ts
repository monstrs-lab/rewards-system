import type { ICommandHandler }       from '@nestjs/cqrs'

import { CommandHandler }             from '@nestjs/cqrs'

import { ReferralAgentFactory }       from '@referral-programs/domain-module'
import { ReferralAgentRepository }    from '@referral-programs/domain-module'

import { CreateReferralAgentCommand } from '../../commands/index.js'

@CommandHandler(CreateReferralAgentCommand)
export class CreateReferralAgentCommandHandler
  implements ICommandHandler<CreateReferralAgentCommand, void>
{
  constructor(
    private readonly referralAgentRepository: ReferralAgentRepository,
    private readonly referralAgentFactory: ReferralAgentFactory
  ) {}

  async execute(command: CreateReferralAgentCommand): Promise<void> {
    const parent = command.referralCode
      ? await this.referralAgentRepository.findByCode(command.referralCode)
      : undefined

    await this.referralAgentRepository.save(
      this.referralAgentFactory.create().create(command.id, parent?.id)
    )
  }
}

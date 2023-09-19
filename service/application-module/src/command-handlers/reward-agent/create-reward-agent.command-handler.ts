import type { ICommandHandler }     from '@nestjs/cqrs'

import { CommandHandler }           from '@nestjs/cqrs'

import { RewardAgent }              from '@rewards-system/domain-module'
import { RewardAgentRepository }    from '@rewards-system/domain-module'

import { CreateRewardAgentCommand } from '../../commands/index.js'

@CommandHandler(CreateRewardAgentCommand)
export class CreateRewardAgentCommandHandler
  implements ICommandHandler<CreateRewardAgentCommand, void>
{
  constructor(private readonly rewardAgentRepository: RewardAgentRepository) {}

  async execute(command: CreateRewardAgentCommand): Promise<void> {
    const exists = await this.rewardAgentRepository.findById(command.id)

    if (!exists) {
      const parent = command.referralCode
        ? await this.rewardAgentRepository.findByCode(command.referralCode)
        : undefined

      await this.rewardAgentRepository.save(new RewardAgent().create(command.id, parent?.id))
    }
  }
}

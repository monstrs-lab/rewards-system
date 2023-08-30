import type { ICommandHandler }     from '@nestjs/cqrs'

import { CommandHandler }           from '@nestjs/cqrs'

import { RewardAgentFactory }       from '@rewards-system/domain-module'
import { RewardAgentRepository }    from '@rewards-system/domain-module'

import { CreateRewardAgentCommand } from '../../commands/index.js'

@CommandHandler(CreateRewardAgentCommand)
export class CreateRewardAgentCommandHandler
  implements ICommandHandler<CreateRewardAgentCommand, void>
{
  constructor(
    private readonly rewardAgentRepository: RewardAgentRepository,
    private readonly rewardAgentFactory: RewardAgentFactory
  ) {}

  async execute(command: CreateRewardAgentCommand): Promise<void> {
    const parent = command.rewardCode
      ? await this.rewardAgentRepository.findByCode(command.rewardCode)
      : undefined

    await this.rewardAgentRepository.save(
      this.rewardAgentFactory.create().create(command.id, parent?.id)
    )
  }
}

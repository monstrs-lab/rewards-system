import type { ICommandHandler }       from '@nestjs/cqrs'

import assert                         from 'node:assert'

import { CommandHandler }             from '@nestjs/cqrs'

import { RewardProgram }              from '@rewards-system/domain-module'
import { RewardProgramRepository }    from '@rewards-system/domain-module'

import { CreateRewardProgramCommand } from '../../commands/index.js'

@CommandHandler(CreateRewardProgramCommand)
export class CreateRewardProgramCommandHandler
  implements ICommandHandler<CreateRewardProgramCommand, void>
{
  constructor(private readonly rewardProgramRepository: RewardProgramRepository) {}

  async execute(command: CreateRewardProgramCommand): Promise<void> {
    const exists = await this.rewardProgramRepository.findByCode(command.code)

    assert.ok(!exists, `Reward program with code '${command.code}' already exists`)

    await this.rewardProgramRepository.save(
      new RewardProgram().create(
        command.rewardProgramId,
        command.name,
        command.code,
        command.percentage
      )
    )
  }
}

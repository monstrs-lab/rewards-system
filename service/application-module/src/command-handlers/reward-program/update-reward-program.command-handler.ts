import type { ICommandHandler }       from '@nestjs/cqrs'

import assert                         from 'node:assert'

import { CommandHandler }             from '@nestjs/cqrs'

import { RewardProgramRepository }    from '@rewards-system/domain-module'

import { UpdateRewardProgramCommand } from '../../commands/index.js'

@CommandHandler(UpdateRewardProgramCommand)
export class UpdateRewardProgramCommandHandler
  implements ICommandHandler<UpdateRewardProgramCommand, void>
{
  constructor(private readonly rewardProgramRepository: RewardProgramRepository) {}

  async execute(command: UpdateRewardProgramCommand): Promise<void> {
    const rewardProgram = await this.rewardProgramRepository.findById(command.rewardProgramId)

    assert.ok(rewardProgram, `Reward program with id '${command.rewardProgramId}' not found`)

    await this.rewardProgramRepository.save(rewardProgram.update(command.name, command.percentage))
  }
}

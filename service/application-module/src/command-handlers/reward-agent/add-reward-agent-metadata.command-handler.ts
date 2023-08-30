import type { ICommandHandler }          from '@nestjs/cqrs'

import assert                            from 'node:assert'

import { CommandHandler }                from '@nestjs/cqrs'

import { RewardAgentRepository }         from '@rewards-system/domain-module'

import { AddRewardAgentMetadataCommand } from '../../commands/index.js'

@CommandHandler(AddRewardAgentMetadataCommand)
export class AddRewardAgentMetadataCommandHandler
  implements ICommandHandler<AddRewardAgentMetadataCommand, void>
{
  constructor(private readonly rewardAgentRepository: RewardAgentRepository) {}

  async execute(command: AddRewardAgentMetadataCommand): Promise<void> {
    const rewardAgent = await this.rewardAgentRepository.findById(command.rewardAgentId)

    assert.ok(rewardAgent, `Reward agent with id '${command.rewardAgentId}' not found`)

    await this.rewardAgentRepository.save(rewardAgent.addMetadata(command.metadata))
  }
}

import type { ICommandHandler }            from '@nestjs/cqrs'

import assert                              from 'node:assert'

import { CommandHandler }                  from '@nestjs/cqrs'

import { ReferralAgentRepository }         from '@referral-programs/domain-module'

import { AddReferralAgentMetadataCommand } from '../commands/index.js'

@CommandHandler(AddReferralAgentMetadataCommand)
export class AddReferralAgentMetadataCommandHandler
  implements ICommandHandler<AddReferralAgentMetadataCommand, void>
{
  constructor(private readonly referralAgentRepository: ReferralAgentRepository) {}

  async execute(command: AddReferralAgentMetadataCommand): Promise<void> {
    const referralAgent = await this.referralAgentRepository.findById(command.referralAgentId)

    assert.ok(referralAgent, `Referral agent with id '${command.referralAgentId}' not found`)

    await this.referralAgentRepository.save(referralAgent.addMetadata(command.metadata))
  }
}

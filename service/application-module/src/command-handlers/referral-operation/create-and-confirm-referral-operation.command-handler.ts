import type { ICommandHandler }                     from '@nestjs/cqrs'

import assert                                       from 'node:assert'

import { CommandHandler }                           from '@nestjs/cqrs'

import { ReferralOperationFactory }                 from '@referral-programs/domain-module'
import { ReferralOperationRepository }              from '@referral-programs/domain-module'
import { ReferralProgramRepository }                from '@referral-programs/domain-module'
import { ReferralOperationSource }                  from '@referral-programs/domain-module'

import { CreateAndConfirmReferralOperationCommand } from '../../commands/index.js'

@CommandHandler(CreateAndConfirmReferralOperationCommand)
export class CreateAndConfirmReferralOperationCommandHandler
  implements ICommandHandler<CreateAndConfirmReferralOperationCommand, void>
{
  constructor(
    private readonly referralOperationRepository: ReferralOperationRepository,
    private readonly referralProgramRepository: ReferralProgramRepository,
    private readonly referralOperationFactory: ReferralOperationFactory
  ) {}

  async execute(command: CreateAndConfirmReferralOperationCommand): Promise<void> {
    const referralProgram = await this.referralProgramRepository.findByCode(command.referralProgram)

    assert.ok(referralProgram, `Referral program with code '${command.referralProgram}' not found`)

    await this.referralOperationRepository.save(
      this.referralOperationFactory
        .create()
        .create(
          command.referralOperationId,
          referralProgram.id,
          ReferralOperationSource.create(command.sourceId, command.sourceType),
          command.referrerId,
          command.amount
        )
        .confirm()
    )
  }
}

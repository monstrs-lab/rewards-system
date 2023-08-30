import type { ICommandHandler }           from '@nestjs/cqrs'

import assert                             from 'node:assert'

import { CommandHandler }                 from '@nestjs/cqrs'

import { ReferralOperationFactory }       from '@referral-programs/domain-module'
import { ReferralOperationRepository }    from '@referral-programs/domain-module'
import { ReferralProgramRepository }      from '@referral-programs/domain-module'
import { ReferralProfitRepository }       from '@referral-programs/domain-module'
import { ReferralAgentRepository }        from '@referral-programs/domain-module'
import { ReferralOperationSource }        from '@referral-programs/domain-module'

import { CreateReferralOperationCommand } from '../../commands/index.js'

@CommandHandler(CreateReferralOperationCommand)
export class CreateReferralOperationCommandHandler
  implements ICommandHandler<CreateReferralOperationCommand, void>
{
  constructor(
    private readonly referralOperationRepository: ReferralOperationRepository,
    private readonly referralProgramRepository: ReferralProgramRepository,
    private readonly referralOperationFactory: ReferralOperationFactory,
    private readonly referralProfitRepository: ReferralProfitRepository,
    private readonly referralAgentRepository: ReferralAgentRepository
  ) {}

  async execute(command: CreateReferralOperationCommand): Promise<void> {
    const referralProgram = await this.referralProgramRepository.findByCode(command.referralProgram)

    assert.ok(referralProgram, `Referral program with code '${command.referralProgram}' not found`)

    const referralOperation = this.referralOperationFactory
      .create()
      .create(
        command.referralOperationId,
        referralProgram.id,
        command.referrerId,
        ReferralOperationSource.create(command.sourceId, command.sourceType),
        command.amount
      )

    await this.referralOperationRepository.save(referralOperation)

    const referrer = await this.referralAgentRepository.findById(referralOperation.referrerId)

    if (referrer) {
      const recipients = await this.referralAgentRepository.findRecipients(referrer)

      const referralProfits = await referralProgram.calculate(
        referralOperation,
        referrer,
        recipients
      )

      for await (const referralProfit of referralProfits) {
        await this.referralProfitRepository.save(referralProfit)
      }
    }
  }
}

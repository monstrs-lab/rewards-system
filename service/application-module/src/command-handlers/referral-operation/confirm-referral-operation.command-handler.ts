import type { ICommandHandler }            from '@nestjs/cqrs'

import assert                              from 'node:assert'

import { CommandHandler }                  from '@nestjs/cqrs'

import { ReferralOperationRepository }     from '@referral-programs/domain-module'
import { ReferralProfitRepository }        from '@referral-programs/domain-module'

import { ConfirmReferralOperationCommand } from '../../commands/index.js'

@CommandHandler(ConfirmReferralOperationCommand)
export class ConfirmReferralOperationCommandHandler
  implements ICommandHandler<ConfirmReferralOperationCommand, void>
{
  constructor(
    private readonly referralOperationRepository: ReferralOperationRepository,
    private readonly referralProfitRepository: ReferralProfitRepository
  ) {}

  async execute(command: ConfirmReferralOperationCommand): Promise<void> {
    const referralOperation = await this.referralOperationRepository.findById(
      command.referralOperationId
    )

    assert.ok(
      referralOperation,
      `Referral operation with id '${command.referralOperationId}' not found`
    )

    const referralProfits = await this.referralProfitRepository.findByOperationId(
      referralOperation.id
    )

    await this.referralOperationRepository.save(referralOperation.confirm())

    for await (const referralProfit of referralProfits) {
      await this.referralProfitRepository.save(referralProfit.confirm())
    }
  }
}

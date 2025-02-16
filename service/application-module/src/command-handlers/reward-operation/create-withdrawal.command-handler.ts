import type { ICommandHandler }          from '@nestjs/cqrs'

import assert                            from 'node:assert'

import { CommandHandler }                from '@nestjs/cqrs'
import { BigNumber }                     from 'bignumber.js'

import { RewardPointsBalanceRepository } from '@rewards-system/domain-module'
import { Withdrawal }                    from '@rewards-system/domain-module'
import { WithdrawalRepository }          from '@rewards-system/domain-module'

import { CreateWithdrawalCommand }       from '../../commands/index.js'

@CommandHandler(CreateWithdrawalCommand)
export class CreateWithdrawalCommandHandler
  implements ICommandHandler<CreateWithdrawalCommand, void>
{
  constructor(
    private readonly rewardPointsBalanceRepository: RewardPointsBalanceRepository,
    private readonly withdrawalRepository: WithdrawalRepository
  ) {}

  async execute(command: CreateWithdrawalCommand): Promise<void> {
    const balance = await this.rewardPointsBalanceRepository.findById(command.ownerId)

    assert.ok(balance, 'Balance not found')
    assert.ok(balance.amount >= command.amount, 'Not enough balance')

    await this.withdrawalRepository.save(
      new Withdrawal().create(command.withdrawalId, command.ownerId, new BigNumber(command.amount))
    )
  }
}

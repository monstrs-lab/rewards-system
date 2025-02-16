import type { IQueryHandler }     from '@nestjs/cqrs'
import type { Withdrawal }        from '@rewards-system/domain-module'

import { QueryHandler }           from '@nestjs/cqrs'

import { WithdrawalRepository }   from '@rewards-system/domain-module'

import { GetWithdrawalByIdQuery } from '../../queries/index.js'

@QueryHandler(GetWithdrawalByIdQuery)
export class GetWithdrawalByIdQueryHandler implements IQueryHandler<GetWithdrawalByIdQuery> {
  constructor(private readonly withdrawalRepository: WithdrawalRepository) {}

  async execute(query: GetWithdrawalByIdQuery): Promise<Withdrawal | undefined> {
    return this.withdrawalRepository.findById(query.id)
  }
}

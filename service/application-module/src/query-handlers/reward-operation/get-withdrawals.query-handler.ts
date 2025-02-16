import type { IQueryHandler }                from '@nestjs/cqrs'
import type { FindWithdrawalsByQueryResult } from '@rewards-system/domain-module'

import { QueryHandler }                      from '@nestjs/cqrs'

import { WithdrawalRepository }              from '@rewards-system/domain-module'

import { GetWithdrawalsQuery }               from '../../queries/index.js'

@QueryHandler(GetWithdrawalsQuery)
export class GetWithdrawalsQueryHandler implements IQueryHandler<GetWithdrawalsQuery> {
  constructor(private readonly withdrawalRepository: WithdrawalRepository) {}

  async execute({
    pager,
    order,
    query,
  }: GetWithdrawalsQuery): Promise<FindWithdrawalsByQueryResult> {
    return this.withdrawalRepository.findByQuery({
      pager,
      order,
      query,
    })
  }
}

import type { Reward }          from '../aggregates/index.js'
import type { RewardOperation } from '../aggregates/index.js'

export abstract class TransactionalRepository {
  abstract saveOperationAndRewards(
    rewarOperation: RewardOperation,
    rewards: Array<Reward>
  ): Promise<void>
}

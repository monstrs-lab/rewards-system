import { Injectable }          from '@nestjs/common'

import { RewardPointsBalance } from '../aggregates/index.js'

@Injectable()
export class RewardPointsBalanceFactory {
  create(): RewardPointsBalance {
    return new RewardPointsBalance()
  }
}

import { Injectable }            from '@nestjs/common'

import { ReferralPointsBalance } from '../aggregates/index.js'

@Injectable()
export class ReferralPointsBalanceFactory {
  create(): ReferralPointsBalance {
    return new ReferralPointsBalance()
  }
}

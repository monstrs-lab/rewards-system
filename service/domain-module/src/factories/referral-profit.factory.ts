import { Injectable }     from '@nestjs/common'

import { ReferralProfit } from '../aggregates/index.js'

@Injectable()
export class ReferralProfitFactory {
  create(): ReferralProfit {
    return new ReferralProfit()
  }
}

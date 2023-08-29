import { Injectable }    from '@nestjs/common'

import { ReferralAgent } from '../aggregates/index.js'

@Injectable()
export class ReferralAgentFactory {
  create(): ReferralAgent {
    return new ReferralAgent()
  }
}

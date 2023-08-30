import { Injectable }  from '@nestjs/common'

import { RewardAgent } from '../aggregates/index.js'

@Injectable()
export class RewardAgentFactory {
  create(): RewardAgent {
    return new RewardAgent()
  }
}

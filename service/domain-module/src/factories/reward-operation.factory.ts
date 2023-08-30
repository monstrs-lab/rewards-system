import { Injectable }      from '@nestjs/common'

import { RewardOperation } from '../aggregates/index.js'

@Injectable()
export class RewardOperationFactory {
  create(): RewardOperation {
    return new RewardOperation()
  }
}

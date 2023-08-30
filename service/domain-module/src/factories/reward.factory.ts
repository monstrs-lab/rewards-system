import { Injectable } from '@nestjs/common'

import { Reward }     from '../aggregates/index.js'

@Injectable()
export class RewardFactory {
  create(): Reward {
    return new Reward()
  }
}

import { Injectable }    from '@nestjs/common'

import { RewardProgram } from '../aggregates/index.js'

@Injectable()
export class RewardProgramFactory {
  create(): RewardProgram {
    return new RewardProgram()
  }
}

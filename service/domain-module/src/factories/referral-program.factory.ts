import { Injectable }      from '@nestjs/common'

import { ReferralProgram } from '../aggregates/index.js'

@Injectable()
export class ReferralProgramFactory {
  create(): ReferralProgram {
    return new ReferralProgram()
  }
}

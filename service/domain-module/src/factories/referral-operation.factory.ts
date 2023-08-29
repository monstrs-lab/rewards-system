import { Injectable }        from '@nestjs/common'

import { ReferralOperation } from '../aggregates/index.js'

@Injectable()
export class ReferralOperationFactory {
  create(): ReferralOperation {
    return new ReferralOperation()
  }
}

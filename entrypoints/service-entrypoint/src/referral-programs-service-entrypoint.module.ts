import { Module }                               from '@nestjs/common'

import { MicroservisesRegistryModule }          from '@referral-programs/infrastructure-module'
import { ReferralProgramsInfrastructureModule } from '@referral-programs/infrastructure-module'

@Module({
  imports: [
    MicroservisesRegistryModule.register(),
    ReferralProgramsInfrastructureModule.register(),
  ],
})
export class ReferralProgramsServiceEntrypointModule {}

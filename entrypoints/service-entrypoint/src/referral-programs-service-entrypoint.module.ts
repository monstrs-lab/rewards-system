import { Module }                               from '@nestjs/common'

import { MicroservisesRegistryModule }          from '@referral-programs/infrastructure-module'
import { ReferralProgramsInfrastructureModule } from '@referral-programs/infrastructure-module'
import { ReferralProgramsDomainModule }         from '@referral-programs/domain-module'
import { ReferralProgramsApplicationModule }    from '@referral-programs/application-module'

@Module({
  imports: [
    MicroservisesRegistryModule.register(),
    ReferralProgramsInfrastructureModule.register(),
    ReferralProgramsApplicationModule.register(),
    ReferralProgramsDomainModule.register(),
  ],
})
export class ReferralProgramsServiceEntrypointModule {}

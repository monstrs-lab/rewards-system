import { Module }                            from '@nestjs/common'
import { MicroservisesRegistryModule }       from '@monstrs/nestjs-microservices-registry'

import { RewardsSystemInfrastructureModule } from '@rewards-system/infrastructure-module'
import { RewardsSystemDomainModule }         from '@rewards-system/domain-module'
import { RewardsSystemApplicationModule }    from '@rewards-system/application-module'

@Module({
  imports: [
    MicroservisesRegistryModule.register(),
    RewardsSystemInfrastructureModule.register(),
    RewardsSystemApplicationModule.register(),
    RewardsSystemDomainModule.register(),
  ],
})
export class RewardsSystemServiceEntrypointModule {}

import { Module }                            from '@nestjs/common'
import { MicroservisesRegistryModule }       from '@monstrs/nestjs-microservices-registry'

import { RewardsSystemInfrastructureModule } from '@rewards-system/infrastructure-module'
import { RewardsSystemApplicationModule }    from '@rewards-system/application-module'

@Module({
  imports: [
    MicroservisesRegistryModule.register(),
    RewardsSystemInfrastructureModule.register(),
    RewardsSystemApplicationModule.register(),
  ],
})
export class RewardsSystemServiceEntrypointModule {}

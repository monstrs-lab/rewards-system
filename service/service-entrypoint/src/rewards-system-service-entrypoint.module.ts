import { MicroservisesRegistryModule }       from '@monstrs/nestjs-microservices-registry'
import { Module }                            from '@nestjs/common'

import { RewardsSystemApplicationModule }    from '@rewards-system/application-module'
import { RewardsSystemInfrastructureModule } from '@rewards-system/infrastructure-module'

@Module({
  imports: [
    MicroservisesRegistryModule.register(),
    RewardsSystemInfrastructureModule.register(),
    RewardsSystemApplicationModule.register(),
  ],
})
export class RewardsSystemServiceEntrypointModule {}

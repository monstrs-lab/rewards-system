import type { MikroOrmModuleOptions }                    from '@mikro-orm/nestjs'
import type { CqrsKafkaEventsModuleOptions }             from '@monstrs/nestjs-cqrs-kafka-events'

import type { RewardsSystemInfrastructureModuleOptions } from './rewards-system-infrastructure.module.interfaces.js'

import { Inject }                                        from '@nestjs/common'

import { REWARDS_SYSTEM_INFRASTRUCTURE_MODULE_OPTIONS }  from './rewards-system-infrastructure.module.constants.js'

export class RewardsSystemInfrastructureModuleConfig {
  constructor(
    @Inject(REWARDS_SYSTEM_INFRASTRUCTURE_MODULE_OPTIONS)
    private readonly options: RewardsSystemInfrastructureModuleOptions
  ) {}

  get events(): CqrsKafkaEventsModuleOptions {
    return this.options.events || {}
  }

  get db(): Partial<MikroOrmModuleOptions> {
    return this.options.db || {}
  }
}

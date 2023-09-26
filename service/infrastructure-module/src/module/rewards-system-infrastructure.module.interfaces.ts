import type { MikroOrmModuleOptions }        from '@mikro-orm/nestjs'
import type { CqrsKafkaEventsModuleOptions } from '@monstrs/nestjs-cqrs-kafka-events'

export interface RewardsSystemInfrastructureModuleOptions {
  events?: CqrsKafkaEventsModuleOptions
  db?: Partial<MikroOrmModuleOptions>
}

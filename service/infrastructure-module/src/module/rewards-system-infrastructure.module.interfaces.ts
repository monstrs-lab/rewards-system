import type { CqrsKafkaEventsModuleOptions } from '@monstrs/nestjs-cqrs-kafka-events'
import type { MikroOrmModuleOptions }        from '@mikro-orm/nestjs'

export interface RewardsSystemInfrastructureModuleOptions {
  events?: CqrsKafkaEventsModuleOptions
  db?: Partial<MikroOrmModuleOptions>
}

import type { OnModuleInit }                             from '@nestjs/common'
import type { DynamicModule }                            from '@nestjs/common'
import type { MikroOrmModuleOptions }                    from '@mikro-orm/nestjs'

import type { RewardsSystemInfrastructureModuleOptions } from './rewards-system-infrastructure.module.interfaces.js'

import { Module }                                        from '@nestjs/common'
import { ValidationModule }                              from '@monstrs/nestjs-validation'
import { ConnectRpcServer }                              from '@monstrs/nestjs-connectrpc'
import { ServerProtocol }                                from '@monstrs/nestjs-connectrpc'
import { MicroservisesRegistryModule }                   from '@monstrs/nestjs-microservices-registry'
import { MikroOrmModule }                                from '@mikro-orm/nestjs'
import { MikroORM }                                      from '@mikro-orm/core'
import { MikroORMRequestContextModule }                  from '@monstrs/nestjs-mikro-orm-request-context'
import { PostgreSqlDriver }                              from '@mikro-orm/postgresql'
import { MikroORMConfigModule }                          from '@monstrs/nestjs-mikro-orm-config'
import { MikroORMConfig }                                from '@monstrs/nestjs-mikro-orm-config'
import { CqrsModule }                                    from '@monstrs/nestjs-cqrs'
import { CqrsKafkaEventsModule }                         from '@monstrs/nestjs-cqrs-kafka-events'

import { RewardPointsJournalEntryRepository }            from '@rewards-system/domain-module'
import { RewardPointsBalanceRepository }                 from '@rewards-system/domain-module'
import { RewardOperationRepository }                     from '@rewards-system/domain-module'
import { RewardProgramRepository }                       from '@rewards-system/domain-module'
import { RewardRepository }                              from '@rewards-system/domain-module'
import { RewardAgentRepository }                         from '@rewards-system/domain-module'

import * as controllers                                  from '../controllers/index.js'
import * as mappers                                      from '../mappers/index.js'
import * as entities                                     from '../entities/index.js'
import * as migrations                                   from '../migrations/index.js'
import { RewardPointsJournalEntryRepositoryImpl }        from '../repositories/index.js'
import { RewardPointsBalanceRepositoryImpl }             from '../repositories/index.js'
import { RewardOperationRepositoryImpl }                 from '../repositories/index.js'
import { RewardProgramRepositoryImpl }                   from '../repositories/index.js'
import { RewardRepositoryImpl }                          from '../repositories/index.js'
import { RewardAgentRepositoryImpl }                     from '../repositories/index.js'
import { REWARDS_SYSTEM_INFRASTRUCTURE_MODULE_OPTIONS }  from './rewards-system-infrastructure.module.constants.js'
import { RewardsSystemInfrastructureModuleConfig }       from './rewards-system-infrastructure.module.config.js'

@Module({})
export class RewardsSystemInfrastructureModule implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  static register(options: RewardsSystemInfrastructureModuleOptions = {}): DynamicModule {
    const repositories = [
      {
        provide: REWARDS_SYSTEM_INFRASTRUCTURE_MODULE_OPTIONS,
        useValue: options,
      },
      {
        provide: RewardsSystemInfrastructureModuleConfig,
        useClass: RewardsSystemInfrastructureModuleConfig,
      },
      {
        provide: RewardProgramRepository,
        useClass: RewardProgramRepositoryImpl,
      },
      {
        provide: RewardAgentRepository,
        useClass: RewardAgentRepositoryImpl,
      },
      {
        provide: RewardOperationRepository,
        useClass: RewardOperationRepositoryImpl,
      },
      {
        provide: RewardRepository,
        useClass: RewardRepositoryImpl,
      },
      {
        provide: RewardPointsBalanceRepository,
        useClass: RewardPointsBalanceRepositoryImpl,
      },
      {
        provide: RewardPointsJournalEntryRepository,
        useClass: RewardPointsJournalEntryRepositoryImpl,
      },
    ]

    return {
      global: true,
      module: RewardsSystemInfrastructureModule,
      controllers: Object.values(controllers),
      imports: [
        MikroORMRequestContextModule.forInterceptor(),
        MicroservisesRegistryModule.connect({
          strategy: new ConnectRpcServer({
            protocol: ServerProtocol.HTTP2_INSECURE,
            port: 50051,
          }),
        }),
        ValidationModule.register(),
        CqrsModule.forRoot(),
        MikroOrmModule.forFeature(Object.values(entities)),
        MikroOrmModule.forRootAsync({
          imports: [
            MikroORMConfigModule.register({
              driver: PostgreSqlDriver,
              migrationsTableName: 'mikro_orm_migrations_rewards_system',
              migrationsList: migrations,
              entities,
            }),
          ],
          useFactory: (mikroORMConfig: MikroORMConfig, config): MikroOrmModuleOptions =>
            ({
              ...mikroORMConfig.createMikroOrmOptions(),
              ...config.db,
            }) as MikroOrmModuleOptions,
          inject: [MikroORMConfig, RewardsSystemInfrastructureModuleConfig],
        }),
        CqrsKafkaEventsModule.registerAsync({
          useFactory: (config: RewardsSystemInfrastructureModuleConfig) => config.events,
          inject: [RewardsSystemInfrastructureModuleConfig],
        }),
      ],
      providers: [...Object.values(mappers), ...repositories],
      exports: [...repositories],
    }
  }

  async onModuleInit(): Promise<void> {
    await this.orm.getMigrator().up()
  }
}

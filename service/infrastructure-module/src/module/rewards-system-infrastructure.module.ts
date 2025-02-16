import type { MikroOrmModuleOptions }                    from '@mikro-orm/nestjs'
import type { OnApplicationBootstrap }                   from '@nestjs/common'
import type { OnModuleInit }                             from '@nestjs/common'
import type { DynamicModule }                            from '@nestjs/common'

import type { RewardsSystemInfrastructureModuleOptions } from './rewards-system-infrastructure.module.interfaces.js'

import { RequestContext }                                from '@mikro-orm/core'
import { MikroORM }                                      from '@mikro-orm/core'
import { MikroOrmModule }                                from '@mikro-orm/nestjs'
import { PostgreSqlDriver }                              from '@mikro-orm/postgresql'
import { ConnectRpcServer }                              from '@monstrs/nestjs-connectrpc'
import { ServerProtocol }                                from '@monstrs/nestjs-connectrpc'
import { CqrsModule }                                    from '@monstrs/nestjs-cqrs'
import { CqrsKafkaEventsModule }                         from '@monstrs/nestjs-cqrs-kafka-events'
import { MicroservisesRegistryModule }                   from '@monstrs/nestjs-microservices-registry'
import { MikroORMConfigModule }                          from '@monstrs/nestjs-mikro-orm-config'
import { MikroORMConfig }                                from '@monstrs/nestjs-mikro-orm-config'
import { MikroORMRequestContextModule }                  from '@monstrs/nestjs-mikro-orm-request-context'
import { ValidationModule }                              from '@monstrs/nestjs-validation'
import { Module }                                        from '@nestjs/common'
import { ExplorerService }                               from '@nestjs/cqrs/dist/services/explorer.service.js'

import { TransactionalRepository }                       from '@rewards-system/domain-module'
import { RewardPointsJournalEntryRepository }            from '@rewards-system/domain-module'
import { RewardPointsBalanceRepository }                 from '@rewards-system/domain-module'
import { RewardOperationRepository }                     from '@rewards-system/domain-module'
import { RewardProgramRepository }                       from '@rewards-system/domain-module'
import { RewardAgentRepository }                         from '@rewards-system/domain-module'
import { RewardRepository }                              from '@rewards-system/domain-module'
import { QuestRewardRepository }                         from '@rewards-system/domain-module'
import { WithdrawalRepository }                          from '@rewards-system/domain-module'

import * as controllers                                  from '../controllers/index.js'
import * as entities                                     from '../entities/index.js'
import * as mappers                                      from '../mappers/index.js'
import * as migrations                                   from '../migrations/index.js'
import { TransactionalRepositoryImpl }                   from '../repositories/index.js'
import { RewardPointsJournalEntryRepositoryImpl }        from '../repositories/index.js'
import { WithdrawalRepositoryImpl }                      from '../repositories/index.js'
import { RewardPointsBalanceRepositoryImpl }             from '../repositories/index.js'
import { RewardOperationRepositoryImpl }                 from '../repositories/index.js'
import { RewardProgramRepositoryImpl }                   from '../repositories/index.js'
import { RewardRepositoryImpl }                          from '../repositories/index.js'
import { QuestRewardRepositoryImpl }                     from '../repositories/index.js'
import { RewardAgentRepositoryImpl }                     from '../repositories/index.js'
import { RewardsSystemInfrastructureModuleConfig }       from './rewards-system-infrastructure.module.config.js'
import { REWARDS_SYSTEM_INFRASTRUCTURE_MODULE_OPTIONS }  from './rewards-system-infrastructure.module.constants.js'

@Module({})
export class RewardsSystemInfrastructureModule implements OnApplicationBootstrap, OnModuleInit {
  constructor(
    private readonly explorerService: ExplorerService,
    private readonly orm: MikroORM
  ) {}

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
      {
        provide: TransactionalRepository,
        useClass: TransactionalRepositoryImpl,
      },
      {
        provide: QuestRewardRepository,
        useClass: QuestRewardRepositoryImpl,
      },
      {
        provide: WithdrawalRepository,
        useClass: WithdrawalRepositoryImpl,
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

  onApplicationBootstrap(): void {
    const { events } = this.explorerService.explore()
    const { em } = this.orm

    events?.forEach((event): void => {
      const original: (...args: Array<any>) => any = event.prototype.handle

      // eslint-disable-next-line no-param-reassign
      event.prototype.handle = async function wrap(
        ...args: Array<any>
      ): ReturnType<typeof RequestContext.createAsync> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return RequestContext.createAsync(em, () => original.apply(this, args))
      }
    })
  }

  async onModuleInit(): Promise<void> {
    await this.orm.getMigrator().up()
  }
}

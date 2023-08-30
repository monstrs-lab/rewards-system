import type { OnModuleInit }                      from '@nestjs/common'
import type { DynamicModule }                     from '@nestjs/common'

import { Module }                                 from '@nestjs/common'
import { ValidationModule }                       from '@monstrs/nestjs-validation'
import { ServerBufConnect }                       from '@wolfcoded/nestjs-bufconnect'
import { ServerProtocol }                         from '@wolfcoded/nestjs-bufconnect'
import { MicroservisesRegistryModule }            from '@monstrs/nestjs-microservices-registry'
import { MikroOrmModule }                         from '@mikro-orm/nestjs'
import { MikroORM }                               from '@mikro-orm/core'
import { MikroORMRequestContextModule }           from '@monstrs/nestjs-mikro-orm-request-context'
import { PostgreSqlDriver }                       from '@mikro-orm/postgresql'
import { MikroORMConfigModule }                   from '@monstrs/nestjs-mikro-orm-config'
import { MikroORMConfig }                         from '@monstrs/nestjs-mikro-orm-config'
import { CqrsModule }                             from '@nestjs/cqrs'

import { RewardPointsJournalEntryRepository }     from '@rewards-system/domain-module'
import { RewardPointsBalanceRepository }          from '@rewards-system/domain-module'
import { RewardOperationRepository }              from '@rewards-system/domain-module'
import { RewardProgramRepository }                from '@rewards-system/domain-module'
import { RewardRepository }                       from '@rewards-system/domain-module'
import { RewardAgentRepository }                  from '@rewards-system/domain-module'

import * as controllers                           from '../controllers/index.js'
import * as mappers                               from '../mappers/index.js'
import * as entities                              from '../entities/index.js'
import * as migrations                            from '../migrations/index.js'
import { RewardPointsJournalEntryRepositoryImpl } from '../repositories/index.js'
import { RewardPointsBalanceRepositoryImpl }      from '../repositories/index.js'
import { RewardOperationRepositoryImpl }          from '../repositories/index.js'
import { RewardProgramRepositoryImpl }            from '../repositories/index.js'
import { RewardRepositoryImpl }                   from '../repositories/index.js'
import { RewardAgentRepositoryImpl }              from '../repositories/index.js'

@Module({})
export class RewardsSystemInfrastructureModule implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  static register(): DynamicModule {
    const repositories = [
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
        MicroservisesRegistryModule.connect({
          strategy: new ServerBufConnect({
            protocol: ServerProtocol.HTTP2_INSECURE,
            port: 50051,
          }),
        }),
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
          useExisting: MikroORMConfig,
        }),
        MikroORMRequestContextModule.forInterceptor(),
        CqrsModule.forRoot(),
        ValidationModule.register(),
      ],
      providers: [...Object.values(mappers), ...repositories],
      exports: [...repositories],
    }
  }

  async onModuleInit(): Promise<void> {
    await this.orm.getMigrator().up()
  }
}

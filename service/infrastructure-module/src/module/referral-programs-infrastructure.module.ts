import type { OnModuleInit }               from '@nestjs/common'
import type { DynamicModule }              from '@nestjs/common'

import { Module }                          from '@nestjs/common'
import { ValidationModule }                from '@monstrs/nestjs-validation'
import { ServerBufConnect }                from '@wolfcoded/nestjs-bufconnect'
import { ServerProtocol }                  from '@wolfcoded/nestjs-bufconnect'
import { MicroservisesRegistryModule }     from '@monstrs/nestjs-microservices-registry'
import { MikroOrmModule }                  from '@mikro-orm/nestjs'
import { MikroORM }                        from '@mikro-orm/core'
import { MikroORMRequestContextModule }    from '@monstrs/nestjs-mikro-orm-request-context'
import { PostgreSqlDriver }                from '@mikro-orm/postgresql'
import { MikroORMConfigModule }            from '@monstrs/nestjs-mikro-orm-config'
import { MikroORMConfig }                  from '@monstrs/nestjs-mikro-orm-config'
import { CqrsModule }                      from '@nestjs/cqrs'

import { ReferralOperationRepository }     from '@referral-programs/domain-module'
import { ReferralProgramRepository }       from '@referral-programs/domain-module'
import { ReferralAgentRepository }         from '@referral-programs/domain-module'

import * as controllers                    from '../controllers/index.js'
import * as mappers                        from '../mappers/index.js'
import * as entities                       from '../entities/index.js'
import * as migrations                     from '../migrations/index.js'
import { ReferralOperationRepositoryImpl } from '../repositories/index.js'
import { ReferralProgramRepositoryImpl }   from '../repositories/index.js'
import { ReferralAgentRepositoryImpl }     from '../repositories/index.js'

@Module({})
export class ReferralProgramsInfrastructureModule implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  static register(): DynamicModule {
    const repositories = [
      {
        provide: ReferralProgramRepository,
        useClass: ReferralProgramRepositoryImpl,
      },
      {
        provide: ReferralAgentRepository,
        useClass: ReferralAgentRepositoryImpl,
      },
      {
        provide: ReferralOperationRepository,
        useClass: ReferralOperationRepositoryImpl,
      },
    ]

    return {
      global: true,
      module: ReferralProgramsInfrastructureModule,
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
              migrationsTableName: 'mikro_orm_migrations_referral_programs',
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

import type { INestMicroservice }                  from '@nestjs/common'
import type { StartedTestContainer }               from 'testcontainers'
import type { ReferralProgramsService }            from '@referral-programs/referral-programs-rpc/connect'
import type { PromiseClient }                      from '@referral-programs/referral-programs-rpc'

import { Test }                                    from '@nestjs/testing'
import { findValidationErrorDetails }              from '@monstrs/protobuf-rpc'
import { describe }                                from '@jest/globals'
import { afterAll }                                from '@jest/globals'
import { beforeAll }                               from '@jest/globals'
import { expect }                                  from '@jest/globals'
import { it }                                      from '@jest/globals'
import { faker }                                   from '@faker-js/faker'
import { GenericContainer }                        from 'testcontainers'
import { Wait }                                    from 'testcontainers'
import { default as pg }                           from 'pg'
import getPort                                     from 'get-port'

import { ServerBufConnect }                        from '@referral-programs/infrastructure-module'
import { ServerProtocol }                          from '@referral-programs/infrastructure-module'
import { MIKRO_ORM_CONFIG_MODULE_OPTIONS_PORT }    from '@referral-programs/infrastructure-module'
import { createReferralProgramsClient }            from '@referral-programs/referral-programs-rpc'

import { ReferralProgramsServiceEntrypointModule } from '../src/referral-programs-service-entrypoint.module.js'

describe('referral-programs-service', () => {
  describe('rpc', () => {
    let postgres: StartedTestContainer
    let service: INestMicroservice
    let client: PromiseClient<typeof ReferralProgramsService>

    beforeAll(async () => {
      postgres = await new GenericContainer('bitnami/postgresql')
        .withWaitStrategy(Wait.forLogMessage('database system is ready to accept connections'))
        .withEnvironment({
          POSTGRESQL_PASSWORD: 'password',
          POSTGRESQL_DATABASE: 'db',
        })
        .withExposedPorts(5432)
        .start()

      const pgclient = new pg.Client({
        port: postgres.getMappedPort(5432),
        database: 'db',
        user: 'postgres',
        password: 'password',
      })

      await pgclient.connect()
      await pgclient.query('CREATE EXTENSION IF NOT EXISTS ltree;')
      await pgclient.end()

      const port = await getPort()

      const testingModule = await Test.createTestingModule({
        imports: [ReferralProgramsServiceEntrypointModule],
      })
        .overrideProvider(MIKRO_ORM_CONFIG_MODULE_OPTIONS_PORT)
        .useValue(postgres.getMappedPort(5432))
        .compile()

      service = testingModule.createNestMicroservice({
        strategy: new ServerBufConnect({
          protocol: ServerProtocol.HTTP2_INSECURE,
          port,
        }),
      })

      await service.listen()

      client = createReferralProgramsClient({ baseUrl: `http://localhost:${port}` })
    })

    afterAll(async () => {
      await service.close()
      await postgres.stop()
    })

    describe('referral programs', () => {
      describe('create referral-program', () => {
        it('check empty fields validation', async () => {
          expect.assertions(1)

          try {
            await client.createReferralProgram({})
          } catch (error: any) {
            expect(findValidationErrorDetails(error)).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  id: 'name',
                  property: 'name',
                  messages: expect.arrayContaining([
                    expect.objectContaining({
                      id: 'isNotEmpty',
                      constraint: 'name should not be empty',
                    }),
                  ]),
                }),
                expect.objectContaining({
                  id: 'code',
                  property: 'code',
                  messages: expect.arrayContaining([
                    expect.objectContaining({
                      id: 'isNotEmpty',
                      constraint: 'code should not be empty',
                    }),
                  ]),
                }),
                expect.objectContaining({
                  id: 'percentage',
                  property: 'percentage',
                  messages: expect.arrayContaining([
                    expect.objectContaining({
                      id: 'min',
                      constraint: 'percentage must not be less than 1',
                    }),
                  ]),
                }),
              ])
            )
          }
        })

        it('check create referral program', async () => {
          const { result } = await client.createReferralProgram({
            name: faker.word.sample(),
            code: faker.word.sample(),
            percentage: 1,
          })

          expect(result?.id).toBeTruthy()
          expect(result?.name).toBeTruthy()
          expect(result?.code).toBeTruthy()
          expect(result?.percentage).toBeTruthy()
        })
      })
    })
  })
})

import type { INestMicroservice }                  from '@nestjs/common'
import type { StartedTestContainer }               from 'testcontainers'
import type { ReferralAgentsService }              from '@referral-programs/referral-programs-rpc/connect'
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

import { ConnectError }                            from '@referral-programs/referral-programs-rpc'
import { Struct }                                  from '@referral-programs/referral-programs-rpc'
import { ServerBufConnect }                        from '@referral-programs/infrastructure-module'
import { ServerProtocol }                          from '@referral-programs/infrastructure-module'
import { MIKRO_ORM_CONFIG_MODULE_OPTIONS_PORT }    from '@referral-programs/infrastructure-module'
import { createReferralAgentsClient }              from '@referral-programs/referral-programs-rpc'

import { ReferralProgramsServiceEntrypointModule } from '../src/referral-programs-service-entrypoint.module.js'

describe('referral-agents-service', () => {
  describe('rpc', () => {
    let postgres: StartedTestContainer
    let service: INestMicroservice
    let client: PromiseClient<typeof ReferralAgentsService>

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

      client = createReferralAgentsClient({ baseUrl: `http://localhost:${port}` })
    })

    afterAll(async () => {
      await service.close()
      await postgres.stop()
    })

    describe('referral agents', () => {
      describe('create referral agent', () => {
        it('check invalid id validation', async () => {
          expect.assertions(1)

          try {
            await client.createReferralAgent({})
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(findValidationErrorDetails(error)).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    id: 'id',
                    property: 'id',
                    messages: expect.arrayContaining([
                      expect.objectContaining({
                        id: 'isUuid',
                        constraint: 'id must be a UUID',
                      }),
                    ]),
                  }),
                ])
              )
            }
          }
        })

        it('check create referral agent', async () => {
          const id = faker.string.uuid()

          const { result } = await client.createReferralAgent({
            id,
          })

          expect(result?.id).toBe(id)
        })

        it('check create referral agent with parent', async () => {
          const id = faker.string.uuid()

          const { result: parent } = await client.createReferralAgent({
            id: faker.string.uuid(),
          })

          const { result } = await client.createReferralAgent({
            id,
            referralCode: parent?.code,
          })

          expect(result?.id).toBe(id)
          expect(result?.parentId).toBe(parent?.id)
        })
      })

      describe('add referral agent metadata', () => {
        it('check invalid referral agent id validation', async () => {
          expect.assertions(1)

          try {
            await client.addReferralAgentMetadata({})
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(findValidationErrorDetails(error)).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    id: 'referralAgentId',
                    property: 'referralAgentId',
                    messages: expect.arrayContaining([
                      expect.objectContaining({
                        id: 'isUuid',
                        constraint: 'referralAgentId must be a UUID',
                      }),
                    ]),
                  }),
                ])
              )
            }
          }
        })

        it('check invalid referral agent id validation', async () => {
          expect.assertions(1)

          try {
            await client.addReferralAgentMetadata({})
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(findValidationErrorDetails(error)).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    id: 'metadata',
                    property: 'metadata',
                    messages: expect.arrayContaining([
                      expect.objectContaining({
                        id: 'isNotEmptyObject',
                        constraint: 'metadata must be a non-empty object',
                      }),
                    ]),
                  }),
                ])
              )
            }
          }
        })

        it('check add not found referral agent metadata', async () => {
          expect.assertions(1)

          const referralAgentId = faker.string.uuid()

          try {
            await client.addReferralAgentMetadata({
              referralAgentId,
              metadata: Struct.fromJson({
                test: true,
              }),
            })
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(error.rawMessage).toBe(`Referral agent with id '${referralAgentId}' not found`)
            }
          }
        })

        it('check add  referral agent metadata', async () => {
          const { result: referralAgent } = await client.createReferralAgent({
            id: faker.string.uuid(),
          })

          const { result } = await client.addReferralAgentMetadata({
            referralAgentId: referralAgent!.id,
            metadata: Struct.fromJson({
              test: true,
            }),
          })

          expect(result?.metadata?.toJson()).toEqual({ test: true })
        })
      })

      describe('list referral agents', () => {
        it('check list referral agents id equal query', async () => {
          const { result: referralAgent1 } = await client.createReferralAgent({
            id: faker.string.uuid(),
          })

          const { result: referralAgent2 } = await client.createReferralAgent({
            id: faker.string.uuid(),
            referralCode: referralAgent1?.code,
          })

          const { referralAgents } = await client.listReferralAgents({
            query: {
              id: {
                conditions: {
                  eq: { value: referralAgent2?.id },
                },
              },
            },
          })

          expect(referralAgents.length).toBe(1)
          expect(referralAgents).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: referralAgent2?.id,
              }),
            ])
          )
        })
      })

      describe('get referral agents network', () => {
        it('check list referral agents id equal query', async () => {
          const { result: referralAgent1 } = await client.createReferralAgent({
            id: faker.string.uuid(),
          })

          const { result: referralAgent2 } = await client.createReferralAgent({
            id: faker.string.uuid(),
            referralCode: referralAgent1?.code,
          })

          const { referralAgents } = await client.getReferralAgentNetwork({
            referralAgentId: referralAgent1?.id,
          })

          expect(referralAgents.length).toBe(1)
          expect(referralAgents).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: referralAgent2?.id,
              }),
            ])
          )
        })
      })
    })
  })
})

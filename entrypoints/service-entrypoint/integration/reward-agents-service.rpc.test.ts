import type { INestMicroservice }               from '@nestjs/common'
import type { StartedTestContainer }            from 'testcontainers'
import type { RewardAgentsService }             from '@rewards-system/rewards-system-rpc/connect'
import type { PromiseClient }                   from '@rewards-system/rewards-system-rpc'

import { Test }                                 from '@nestjs/testing'
import { findValidationErrorDetails }           from '@monstrs/protobuf-rpc'
import { describe }                             from '@jest/globals'
import { afterAll }                             from '@jest/globals'
import { beforeAll }                            from '@jest/globals'
import { expect }                               from '@jest/globals'
import { it }                                   from '@jest/globals'
import { faker }                                from '@faker-js/faker'
import { GenericContainer }                     from 'testcontainers'
import { Wait }                                 from 'testcontainers'
import { default as pg }                        from 'pg'
import getPort                                  from 'get-port'

import { ConnectError }                         from '@rewards-system/rewards-system-rpc'
import { Struct }                               from '@rewards-system/rewards-system-rpc'
import { ServerBufConnect }                     from '@rewards-system/infrastructure-module'
import { ServerProtocol }                       from '@rewards-system/infrastructure-module'
import { MIKRO_ORM_CONFIG_MODULE_OPTIONS_PORT } from '@rewards-system/infrastructure-module'
import { createRewardAgentsClient }             from '@rewards-system/rewards-system-rpc'

import { RewardsSystemServiceEntrypointModule } from '../src/rewards-system-service-entrypoint.module.js'

describe('reward-agents-service', () => {
  describe('rpc', () => {
    let postgres: StartedTestContainer
    let service: INestMicroservice
    let client: PromiseClient<typeof RewardAgentsService>

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
        imports: [RewardsSystemServiceEntrypointModule],
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

      client = createRewardAgentsClient({ baseUrl: `http://localhost:${port}` })
    })

    afterAll(async () => {
      await service.close()
      await postgres.stop()
    })

    describe('reward agents', () => {
      describe('create reward agent', () => {
        it('check invalid id validation', async () => {
          expect.assertions(1)

          try {
            await client.createRewardAgent({})
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

        it('check create reward agent', async () => {
          const id = faker.string.uuid()

          const { result } = await client.createRewardAgent({
            id,
          })

          expect(result?.id).toBe(id)
        })

        it('check create reward agent with parent', async () => {
          const id = faker.string.uuid()

          const { result: parent } = await client.createRewardAgent({
            id: faker.string.uuid(),
          })

          const { result } = await client.createRewardAgent({
            id,
            referralCode: parent?.code,
          })

          expect(result?.id).toBe(id)
          expect(result?.parentId).toBe(parent?.id)
        })
      })

      describe('add reward agent metadata', () => {
        it('check invalid reward agent id validation', async () => {
          expect.assertions(1)

          try {
            await client.addRewardAgentMetadata({})
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(findValidationErrorDetails(error)).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    id: 'rewardAgentId',
                    property: 'rewardAgentId',
                    messages: expect.arrayContaining([
                      expect.objectContaining({
                        id: 'isUuid',
                        constraint: 'rewardAgentId must be a UUID',
                      }),
                    ]),
                  }),
                ])
              )
            }
          }
        })

        it('check invalid reward agent id validation', async () => {
          expect.assertions(1)

          try {
            await client.addRewardAgentMetadata({})
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

        it('check add not found reward agent metadata', async () => {
          expect.assertions(1)

          const rewardAgentId = faker.string.uuid()

          try {
            await client.addRewardAgentMetadata({
              rewardAgentId,
              metadata: Struct.fromJson({
                test: true,
              }),
            })
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(error.rawMessage).toBe(`Reward agent with id '${rewardAgentId}' not found`)
            }
          }
        })

        it('check add  reward agent metadata', async () => {
          const { result: rewardAgent } = await client.createRewardAgent({
            id: faker.string.uuid(),
          })

          const { result } = await client.addRewardAgentMetadata({
            rewardAgentId: rewardAgent!.id,
            metadata: Struct.fromJson({
              test: true,
            }),
          })

          expect(result?.metadata?.toJson()).toEqual({ test: true })
        })
      })

      describe('list reward agents', () => {
        it('check list reward agents id equal query', async () => {
          const { result: rewardAgent1 } = await client.createRewardAgent({
            id: faker.string.uuid(),
          })

          const { result: rewardAgent2 } = await client.createRewardAgent({
            id: faker.string.uuid(),
            referralCode: rewardAgent1?.code,
          })

          const { rewardAgents } = await client.listRewardAgents({
            query: {
              id: {
                conditions: {
                  eq: { value: rewardAgent2?.id },
                },
              },
            },
          })

          expect(rewardAgents.length).toBe(1)
          expect(rewardAgents).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: rewardAgent2?.id,
              }),
            ])
          )
        })
      })

      describe('get reward agents network', () => {
        it('check list reward agents id equal query', async () => {
          const { result: rewardAgent1 } = await client.createRewardAgent({
            id: faker.string.uuid(),
          })

          const { result: rewardAgent2 } = await client.createRewardAgent({
            id: faker.string.uuid(),
            referralCode: rewardAgent1?.code,
          })

          const { rewardAgents } = await client.getRewardAgentNetwork({
            rewardAgentId: rewardAgent1?.id,
          })

          expect(rewardAgents.length).toBe(1)
          expect(rewardAgents).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: rewardAgent2?.id,
              }),
            ])
          )
        })
      })
    })
  })
})

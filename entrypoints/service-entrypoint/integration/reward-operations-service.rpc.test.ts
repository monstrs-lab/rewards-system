import type { INestMicroservice }               from '@nestjs/common'
import type { StartedTestContainer }            from 'testcontainers'
import type { RewardAgentsService }             from '@rewards-system/rewards-system-rpc/connect'
import type { RewardOperationsService }         from '@rewards-system/rewards-system-rpc/connect'
import type { RewardProgramsService }           from '@rewards-system/rewards-system-rpc/connect'
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
import { RewardOperationStatus }                from '@rewards-system/rewards-system-rpc/interfaces'
import { createRewardOperationsClient }         from '@rewards-system/rewards-system-rpc'
import { createRewardProgramsClient }           from '@rewards-system/rewards-system-rpc'
import { createRewardAgentsClient }             from '@rewards-system/rewards-system-rpc'

import { RewardsSystemServiceEntrypointModule } from '../src/rewards-system-service-entrypoint.module.js'

describe('reward-operations-service', () => {
  describe('rpc', () => {
    let postgres: StartedTestContainer
    let service: INestMicroservice
    let referraProgramsClient: PromiseClient<typeof RewardProgramsService>
    let rewardAgentsClient: PromiseClient<typeof RewardAgentsService>
    let client: PromiseClient<typeof RewardOperationsService>

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

      referraProgramsClient = createRewardProgramsClient({ baseUrl: `http://localhost:${port}` })
      rewardAgentsClient = createRewardAgentsClient({ baseUrl: `http://localhost:${port}` })
      client = createRewardOperationsClient({ baseUrl: `http://localhost:${port}` })
    })

    afterAll(async () => {
      await service.close()
      await postgres.stop()
    })

    describe('reward operations', () => {
      describe('create reward operation', () => {
        it('check invalid reward program validation', async () => {
          expect.assertions(1)

          try {
            await client.createRewardOperation({})
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(findValidationErrorDetails(error)).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    id: 'rewardProgram',
                    property: 'rewardProgram',
                    messages: expect.arrayContaining([
                      expect.objectContaining({
                        id: 'isNotEmpty',
                        constraint: 'rewardProgram should not be empty',
                      }),
                    ]),
                  }),
                ])
              )
            }
          }
        })

        it('check invalid referrer id validation', async () => {
          expect.assertions(1)

          try {
            await client.createRewardOperation({})
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(findValidationErrorDetails(error)).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    id: 'referrerId',
                    property: 'referrerId',
                    messages: expect.arrayContaining([
                      expect.objectContaining({
                        id: 'isUuid',
                        constraint: 'referrerId must be a UUID',
                      }),
                    ]),
                  }),
                ])
              )
            }
          }
        })

        it('check invalid source id validation', async () => {
          expect.assertions(1)

          try {
            await client.createRewardOperation({})
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(findValidationErrorDetails(error)).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    id: 'sourceId',
                    property: 'sourceId',
                    messages: expect.arrayContaining([
                      expect.objectContaining({
                        id: 'isUuid',
                        constraint: 'sourceId must be a UUID',
                      }),
                    ]),
                  }),
                ])
              )
            }
          }
        })

        it('check invalid source type validation', async () => {
          expect.assertions(1)

          try {
            await client.createRewardOperation({})
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(findValidationErrorDetails(error)).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    id: 'sourceType',
                    property: 'sourceType',
                    messages: expect.arrayContaining([
                      expect.objectContaining({
                        id: 'isNotEmpty',
                        constraint: 'sourceType should not be empty',
                      }),
                    ]),
                  }),
                ])
              )
            }
          }
        })

        it('check invalid amount validation', async () => {
          expect.assertions(1)

          try {
            await client.createRewardOperation({})
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(findValidationErrorDetails(error)).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    id: 'amount',
                    property: 'amount',
                    messages: expect.arrayContaining([
                      expect.objectContaining({
                        id: 'min',
                        constraint: 'amount must not be less than 1',
                      }),
                    ]),
                  }),
                ])
              )
            }
          }
        })

        it('check create with uknown reward program', async () => {
          expect.assertions(1)

          const rewardProgram = faker.word.sample()

          try {
            await client.createRewardOperation({
              rewardProgram,
              referrerId: faker.string.uuid(),
              sourceId: faker.string.uuid(),
              sourceType: faker.word.sample(),
              amount: faker.number.int({ min: 1, max: 100 }),
            })
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(error.rawMessage).toBe(`Reward program with code '${rewardProgram}' not found`)
            }
          }
        })

        it('check create reward operation', async () => {
          const referrerId = faker.string.uuid()
          const sourceId = faker.string.uuid()
          const sourceType = faker.word.sample()
          const amount = faker.number.int({ min: 1, max: 100 })

          const { result: rewardProgram } = await referraProgramsClient.createRewardProgram({
            name: faker.word.sample(),
            code: faker.word.sample(),
            percentage: faker.number.int(100),
          })

          const { result } = await client.createRewardOperation({
            rewardProgram: rewardProgram?.code,
            referrerId,
            sourceId,
            sourceType,
            amount,
          })

          expect(result?.id).toBeTruthy()
          expect(result?.rewardProgramId).toBe(rewardProgram?.id)
          expect(result?.source?.id).toBe(sourceId)
          expect(result?.source?.type).toBe(sourceType)
          expect(result?.amount).toBe(amount)
          expect(result?.status).toBe(RewardOperationStatus.PENDING)
        })

        it('check create and confirm reward operation', async () => {
          const referrerId = faker.string.uuid()
          const sourceId = faker.string.uuid()
          const sourceType = faker.word.sample()
          const amount = faker.number.int({ min: 1, max: 100 })

          const { result: rewardProgram } = await referraProgramsClient.createRewardProgram({
            name: faker.word.sample(),
            code: faker.word.sample(),
            percentage: faker.number.int(100),
          })

          const { result } = await client.createAndConfirmRewardOperation({
            rewardProgram: rewardProgram?.code,
            referrerId,
            sourceId,
            sourceType,
            amount,
          })

          expect(result?.id).toBeTruthy()
          expect(result?.rewardProgramId).toBe(rewardProgram?.id)
          expect(result?.source?.id).toBe(sourceId)
          expect(result?.source?.type).toBe(sourceType)
          expect(result?.amount).toBe(amount)
          expect(result?.status).toBe(RewardOperationStatus.CONFIRMED)
        })
      })

      describe('confirm reward operation', () => {
        it('check invalid reward operation id validation', async () => {
          expect.assertions(1)

          try {
            await client.confirmRewardOperation({})
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(findValidationErrorDetails(error)).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    id: 'rewardOperationId',
                    property: 'rewardOperationId',
                    messages: expect.arrayContaining([
                      expect.objectContaining({
                        id: 'isUuid',
                        constraint: 'rewardOperationId must be a UUID',
                      }),
                    ]),
                  }),
                ])
              )
            }
          }
        })

        it('check confirm uknown reward operation', async () => {
          expect.assertions(1)

          const rewardOperationId = faker.string.uuid()

          try {
            await client.confirmRewardOperation({
              rewardOperationId,
            })
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(error.rawMessage).toBe(
                `Reward operation with id '${rewardOperationId}' not found`
              )
            }
          }
        })

        it('check confirm reward operation', async () => {
          const { result: rewardProgram } = await referraProgramsClient.createRewardProgram({
            name: faker.word.sample(),
            code: faker.word.sample(),
            percentage: faker.number.int(100),
          })

          const { result: rewardOperation } = await client.createRewardOperation({
            rewardProgram: rewardProgram?.code,
            referrerId: faker.string.uuid(),
            sourceId: faker.string.uuid(),
            sourceType: faker.word.sample(),
            amount: faker.number.int({ min: 1, max: 100 }),
          })

          const { result } = await client.confirmRewardOperation({
            rewardOperationId: rewardOperation?.id,
          })

          expect(result?.status).toBe(RewardOperationStatus.CONFIRMED)
        })
      })

      describe('list reward operations', () => {
        it('check list reward operations id equal query', async () => {
          const { result: rewardProgram } = await referraProgramsClient.createRewardProgram({
            name: faker.word.sample(),
            code: faker.word.sample(),
            percentage: faker.number.int(100),
          })

          await client.createRewardOperation({
            rewardProgram: rewardProgram?.code,
            referrerId: faker.string.uuid(),
            sourceId: faker.string.uuid(),
            sourceType: faker.word.sample(),
            amount: faker.number.int({ min: 1, max: 100 }),
          })

          const { result: rewardOperation2 } = await client.createRewardOperation({
            rewardProgram: rewardProgram?.code,
            referrerId: faker.string.uuid(),
            sourceId: faker.string.uuid(),
            sourceType: faker.word.sample(),
            amount: faker.number.int({ min: 1, max: 100 }),
          })

          const { rewardOperations } = await client.listRewardOperations({
            query: {
              id: {
                conditions: {
                  eq: { value: rewardOperation2?.id },
                },
              },
            },
          })

          expect(rewardOperations.length).toBe(1)
          expect(rewardOperations).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: rewardOperation2?.id,
              }),
            ])
          )
        })
      })

      describe('create reward profits', () => {
        it('check reward profits', async () => {
          const { result: rewardProgram } = await referraProgramsClient.createRewardProgram({
            name: faker.word.sample(),
            code: faker.word.sample(),
            percentage: 100,
          })

          await referraProgramsClient.addRewardProgramRule({
            rewardProgramId: rewardProgram!.id,
            name: faker.word.sample(),
            order: faker.number.int(100),
            conditions: Struct.fromJson({ all: [] }),
            fields: [
              {
                percentage: 10,
                conditions: Struct.fromJson({ all: [] }),
              },
            ],
          })

          const { result: rewardAgent1 } = await rewardAgentsClient.createRewardAgent({
            id: faker.string.uuid(),
          })

          const { result: rewardAgent2 } = await rewardAgentsClient.createRewardAgent({
            id: faker.string.uuid(),
            referralCode: rewardAgent1?.code,
          })

          const { result: rewardOperation } = await client.createAndConfirmRewardOperation({
            rewardProgram: rewardProgram?.code,
            referrerId: rewardAgent2?.id,
            sourceId: faker.string.uuid(),
            sourceType: faker.word.sample(),
            amount: 100,
          })

          const { rewards } = await client.listRewards({
            query: {
              operationId: {
                conditions: {
                  eq: {
                    value: rewardOperation?.id,
                  },
                },
              },
            },
          })

          expect(rewards.at(0)?.operationId).toBe(rewardOperation?.id)
          expect(rewards.at(0)?.agentId).toBe(rewardAgent1?.id)
          expect(rewards.at(0)?.referrerId).toBe(rewardAgent2?.id)
          expect(rewards.at(0)?.amount).toBe(100)
          expect(rewards.at(0)?.percentage).toBe(10)
          expect(rewards.at(0)?.profit).toBe(10)
          expect(rewards.at(0)?.level).toBe(1)
        })
      })
    })
  })
})

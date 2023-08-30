import type { INestMicroservice }                  from '@nestjs/common'
import type { StartedTestContainer }               from 'testcontainers'
import type { ReferralAgentsService }              from '@referral-programs/referral-programs-rpc/connect'
import type { ReferralOperationsService }          from '@referral-programs/referral-programs-rpc/connect'
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

import { ConnectError }                            from '@referral-programs/referral-programs-rpc'
import { Struct }                                  from '@referral-programs/referral-programs-rpc'
import { ServerBufConnect }                        from '@referral-programs/infrastructure-module'
import { ServerProtocol }                          from '@referral-programs/infrastructure-module'
import { MIKRO_ORM_CONFIG_MODULE_OPTIONS_PORT }    from '@referral-programs/infrastructure-module'
import { ReferralOperationStatus }                 from '@referral-programs/referral-programs-rpc/interfaces'
import { createReferralOperationsClient }          from '@referral-programs/referral-programs-rpc'
import { createReferralProgramsClient }            from '@referral-programs/referral-programs-rpc'
import { createReferralAgentsClient }              from '@referral-programs/referral-programs-rpc'

import { ReferralProgramsServiceEntrypointModule } from '../src/referral-programs-service-entrypoint.module.js'

describe('referral-operations-service', () => {
  describe('rpc', () => {
    let postgres: StartedTestContainer
    let service: INestMicroservice
    let referraProgramsClient: PromiseClient<typeof ReferralProgramsService>
    let referralAgentsClient: PromiseClient<typeof ReferralAgentsService>
    let client: PromiseClient<typeof ReferralOperationsService>

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

      referraProgramsClient = createReferralProgramsClient({ baseUrl: `http://localhost:${port}` })
      referralAgentsClient = createReferralAgentsClient({ baseUrl: `http://localhost:${port}` })
      client = createReferralOperationsClient({ baseUrl: `http://localhost:${port}` })
    })

    afterAll(async () => {
      await service.close()
      await postgres.stop()
    })

    describe('referral operations', () => {
      describe('create referral operation', () => {
        it('check invalid referral program validation', async () => {
          expect.assertions(1)

          try {
            await client.createReferralOperation({})
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(findValidationErrorDetails(error)).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    id: 'referralProgram',
                    property: 'referralProgram',
                    messages: expect.arrayContaining([
                      expect.objectContaining({
                        id: 'isNotEmpty',
                        constraint: 'referralProgram should not be empty',
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
            await client.createReferralOperation({})
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
            await client.createReferralOperation({})
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
            await client.createReferralOperation({})
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
            await client.createReferralOperation({})
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

        it('check create with uknown referral program', async () => {
          expect.assertions(1)

          const referralProgram = faker.word.sample()

          try {
            await client.createReferralOperation({
              referralProgram,
              referrerId: faker.string.uuid(),
              sourceId: faker.string.uuid(),
              sourceType: faker.word.sample(),
              amount: faker.number.int({ min: 1, max: 100 }),
            })
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(error.rawMessage).toBe(
                `Referral program with code '${referralProgram}' not found`
              )
            }
          }
        })

        it('check create referral operation', async () => {
          const referrerId = faker.string.uuid()
          const sourceId = faker.string.uuid()
          const sourceType = faker.word.sample()
          const amount = faker.number.int({ min: 1, max: 100 })

          const { result: referralProgram } = await referraProgramsClient.createReferralProgram({
            name: faker.word.sample(),
            code: faker.word.sample(),
            percentage: faker.number.int(100),
          })

          const { result } = await client.createReferralOperation({
            referralProgram: referralProgram?.code,
            referrerId,
            sourceId,
            sourceType,
            amount,
          })

          expect(result?.id).toBeTruthy()
          expect(result?.referralProgramId).toBe(referralProgram?.id)
          expect(result?.source?.id).toBe(sourceId)
          expect(result?.source?.type).toBe(sourceType)
          expect(result?.amount).toBe(amount)
          expect(result?.status).toBe(ReferralOperationStatus.PENDING)
        })

        it('check create and confirm referral operation', async () => {
          const referrerId = faker.string.uuid()
          const sourceId = faker.string.uuid()
          const sourceType = faker.word.sample()
          const amount = faker.number.int({ min: 1, max: 100 })

          const { result: referralProgram } = await referraProgramsClient.createReferralProgram({
            name: faker.word.sample(),
            code: faker.word.sample(),
            percentage: faker.number.int(100),
          })

          const { result } = await client.createAndConfirmReferralOperation({
            referralProgram: referralProgram?.code,
            referrerId,
            sourceId,
            sourceType,
            amount,
          })

          expect(result?.id).toBeTruthy()
          expect(result?.referralProgramId).toBe(referralProgram?.id)
          expect(result?.source?.id).toBe(sourceId)
          expect(result?.source?.type).toBe(sourceType)
          expect(result?.amount).toBe(amount)
          expect(result?.status).toBe(ReferralOperationStatus.CONFIRMED)
        })
      })

      describe('confirm referral operation', () => {
        it('check invalid referral operation id validation', async () => {
          expect.assertions(1)

          try {
            await client.confirmReferralOperation({})
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(findValidationErrorDetails(error)).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    id: 'referralOperationId',
                    property: 'referralOperationId',
                    messages: expect.arrayContaining([
                      expect.objectContaining({
                        id: 'isUuid',
                        constraint: 'referralOperationId must be a UUID',
                      }),
                    ]),
                  }),
                ])
              )
            }
          }
        })

        it('check confirm uknown referral operation', async () => {
          expect.assertions(1)

          const referralOperationId = faker.string.uuid()

          try {
            await client.confirmReferralOperation({
              referralOperationId,
            })
          } catch (error) {
            if (error instanceof ConnectError) {
              expect(error.rawMessage).toBe(
                `Referral operation with id '${referralOperationId}' not found`
              )
            }
          }
        })

        it('check confirm referral operation', async () => {
          const { result: referralProgram } = await referraProgramsClient.createReferralProgram({
            name: faker.word.sample(),
            code: faker.word.sample(),
            percentage: faker.number.int(100),
          })

          const { result: referralOperation } = await client.createReferralOperation({
            referralProgram: referralProgram?.code,
            referrerId: faker.string.uuid(),
            sourceId: faker.string.uuid(),
            sourceType: faker.word.sample(),
            amount: faker.number.int({ min: 1, max: 100 }),
          })

          const { result } = await client.confirmReferralOperation({
            referralOperationId: referralOperation?.id,
          })

          expect(result?.status).toBe(ReferralOperationStatus.CONFIRMED)
        })
      })

      describe('list referral operations', () => {
        it('check list referral operations id equal query', async () => {
          const { result: referralProgram } = await referraProgramsClient.createReferralProgram({
            name: faker.word.sample(),
            code: faker.word.sample(),
            percentage: faker.number.int(100),
          })

          await client.createReferralOperation({
            referralProgram: referralProgram?.code,
            referrerId: faker.string.uuid(),
            sourceId: faker.string.uuid(),
            sourceType: faker.word.sample(),
            amount: faker.number.int({ min: 1, max: 100 }),
          })

          const { result: referralOperation2 } = await client.createReferralOperation({
            referralProgram: referralProgram?.code,
            referrerId: faker.string.uuid(),
            sourceId: faker.string.uuid(),
            sourceType: faker.word.sample(),
            amount: faker.number.int({ min: 1, max: 100 }),
          })

          const { referralOperations } = await client.listReferralOperations({
            query: {
              id: {
                conditions: {
                  eq: { value: referralOperation2?.id },
                },
              },
            },
          })

          expect(referralOperations.length).toBe(1)
          expect(referralOperations).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: referralOperation2?.id,
              }),
            ])
          )
        })
      })

      describe('create referral profits', () => {
        it('check referral profits', async () => {
          const { result: referralProgram } = await referraProgramsClient.createReferralProgram({
            name: faker.word.sample(),
            code: faker.word.sample(),
            percentage: 100,
          })

          await referraProgramsClient.addReferralProgramRule({
            referralProgramId: referralProgram!.id,
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

          const { result: referralAgent1 } = await referralAgentsClient.createReferralAgent({
            id: faker.string.uuid(),
          })

          const { result: referralAgent2 } = await referralAgentsClient.createReferralAgent({
            id: faker.string.uuid(),
            referralCode: referralAgent1?.code,
          })

          const { result: referralOperation } = await client.createAndConfirmReferralOperation({
            referralProgram: referralProgram?.code,
            referrerId: referralAgent2?.id,
            sourceId: faker.string.uuid(),
            sourceType: faker.word.sample(),
            amount: 100,
          })

          const { referralProfits } = await client.listReferralProfits({
            query: {
              operationId: {
                conditions: {
                  eq: {
                    value: referralOperation?.id,
                  },
                },
              },
            },
          })

          expect(referralProfits.at(0)?.operationId).toBe(referralOperation?.id)
          expect(referralProfits.at(0)?.agentId).toBe(referralAgent1?.id)
          expect(referralProfits.at(0)?.referrerId).toBe(referralAgent2?.id)
          expect(referralProfits.at(0)?.amount).toBe(100)
          expect(referralProfits.at(0)?.percentage).toBe(10)
          expect(referralProfits.at(0)?.profit).toBe(10)
          expect(referralProfits.at(0)?.level).toBe(1)
        })
      })
    })
  })
})

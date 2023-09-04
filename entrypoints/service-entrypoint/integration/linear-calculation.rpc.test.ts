import type { INestMicroservice }                       from '@nestjs/common'
import type { StartedTestContainer }                    from 'testcontainers'
import type { PromiseClient }                           from '@connectrpc/connect'
import type { StartedKafkaContainer }                   from '@testcontainers/kafka'

import { KafkaContainer }                               from '@testcontainers/kafka'
import { Test }                                         from '@nestjs/testing'
import { EventBus }                                     from '@nestjs/cqrs'
import { Struct }                                       from '@bufbuild/protobuf'
import { ConnectRpcServer }                             from '@monstrs/nestjs-connectrpc'
import { ServerProtocol }                               from '@monstrs/nestjs-connectrpc'
import { describe }                                     from '@jest/globals'
import { afterAll }                                     from '@jest/globals'
import { beforeAll }                                    from '@jest/globals'
import { expect }                                       from '@jest/globals'
import { it }                                           from '@jest/globals'
import { faker }                                        from '@faker-js/faker'
import { createPromiseClient }                          from '@connectrpc/connect'
import { createGrpcTransport }                          from '@connectrpc/connect-node'
import { GenericContainer }                             from 'testcontainers'
import { Wait }                                         from 'testcontainers'
import { default as pg }                                from 'pg'
import getPort                                          from 'get-port'
import retry                                            from 'p-retry'

import { RewardAgentsService }                          from '@rewards-system/rewards-rpc/connect'
import { RewardOperationsService }                      from '@rewards-system/rewards-rpc/connect'
import { RewardProgramsService }                        from '@rewards-system/rewards-rpc/connect'
import { RewardPointsService }                          from '@rewards-system/rewards-rpc/connect'
import { REWARDS_SYSTEM_INFRASTRUCTURE_MODULE_OPTIONS } from '@rewards-system/infrastructure-module'

import { RewardsSystemServiceEntrypointModule }         from '../src/rewards-system-service-entrypoint.module.js'

describe('linear-calculation', () => {
  describe('rpc', () => {
    let postgres: StartedTestContainer
    let kafka: StartedKafkaContainer
    let service: INestMicroservice
    let rewardOperationsClient: PromiseClient<typeof RewardOperationsService>
    let referraProgramsClient: PromiseClient<typeof RewardProgramsService>
    let rewardAgentsClient: PromiseClient<typeof RewardAgentsService>
    let rewardPointsClient: PromiseClient<typeof RewardPointsService>

    beforeAll(async () => {
      kafka = await new KafkaContainer().withExposedPorts(9093).start()

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
        .overrideProvider(REWARDS_SYSTEM_INFRASTRUCTURE_MODULE_OPTIONS)
        .useValue({
          db: {
            port: postgres.getMappedPort(5432),
          },
          events: {
            brokers: [`${kafka.getHost()}:${kafka.getMappedPort(9093)}`],
          },
        })
        .compile()

      const bridge = testingModule.get(EventBus).subject$
      const originalPublish = bridge.next

      bridge.next = function patch(...args): void {
        setTimeout(() => {
          originalPublish.apply(this, args)
        }, 200)
      }

      service = testingModule.createNestMicroservice({
        strategy: new ConnectRpcServer({
          protocol: ServerProtocol.HTTP2_INSECURE,
          port,
        }),
      })

      await service.listen()

      referraProgramsClient = createPromiseClient(
        RewardProgramsService,
        createGrpcTransport({
          httpVersion: '2',
          baseUrl: `http://localhost:${port}`,
          idleConnectionTimeoutMs: 1000,
        })
      )

      rewardOperationsClient = createPromiseClient(
        RewardOperationsService,
        createGrpcTransport({
          httpVersion: '2',
          baseUrl: `http://localhost:${port}`,
          idleConnectionTimeoutMs: 1000,
        })
      )

      rewardAgentsClient = createPromiseClient(
        RewardAgentsService,
        createGrpcTransport({
          httpVersion: '2',
          baseUrl: `http://localhost:${port}`,
          idleConnectionTimeoutMs: 1000,
        })
      )

      rewardPointsClient = createPromiseClient(
        RewardPointsService,
        createGrpcTransport({
          httpVersion: '2',
          baseUrl: `http://localhost:${port}`,
          idleConnectionTimeoutMs: 1000,
        })
      )
    })

    afterAll(async () => {
      await service.close()
      await postgres.stop()
      await kafka.stop()
    })

    describe('reward program', () => {
      let rewardProgramCode: string

      beforeAll(async () => {
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
              percentage: 40,
              conditions: Struct.fromJson({
                all: [
                  {
                    fact: 'allow',
                    operator: 'equal',
                    value: true,
                  },
                ],
              }),
            },
            {
              percentage: 20,
              conditions: Struct.fromJson({
                all: [
                  {
                    fact: 'allow',
                    operator: 'equal',
                    value: true,
                  },
                ],
              }),
            },
            {
              percentage: 20,
              conditions: Struct.fromJson({
                all: [
                  {
                    fact: 'allow',
                    operator: 'equal',
                    value: true,
                  },
                ],
              }),
            },
            {
              percentage: 10,
              conditions: Struct.fromJson({
                all: [
                  {
                    fact: 'allow',
                    operator: 'equal',
                    value: true,
                  },
                ],
              }),
            },
            {
              percentage: 10,
              conditions: Struct.fromJson({
                all: [
                  {
                    fact: 'allow',
                    operator: 'equal',
                    value: true,
                  },
                ],
              }),
            },
          ],
        })

        rewardProgramCode = rewardProgram!.code
      })

      describe('check reward everyone', () => {
        let rewardAgent1Id: string
        let rewardAgent2Id: string
        let rewardAgent3Id: string
        let rewardAgent4Id: string
        let rewardAgent5Id: string
        let rewardAgent6Id: string

        beforeAll(async () => {
          const { result: rewardAgent1 } = await rewardAgentsClient.createRewardAgent({
            id: faker.string.uuid(),
          })

          await rewardAgentsClient.addRewardAgentMetadata({
            rewardAgentId: rewardAgent1?.id,
            metadata: Struct.fromJson({
              allow: true,
            }),
          })

          const { result: rewardAgent2 } = await rewardAgentsClient.createRewardAgent({
            id: faker.string.uuid(),
            referralCode: rewardAgent1?.code,
          })

          await rewardAgentsClient.addRewardAgentMetadata({
            rewardAgentId: rewardAgent2?.id,
            metadata: Struct.fromJson({
              allow: true,
            }),
          })

          const { result: rewardAgent3 } = await rewardAgentsClient.createRewardAgent({
            id: faker.string.uuid(),
            referralCode: rewardAgent2?.code,
          })

          await rewardAgentsClient.addRewardAgentMetadata({
            rewardAgentId: rewardAgent3?.id,
            metadata: Struct.fromJson({
              allow: true,
            }),
          })

          const { result: rewardAgent4 } = await rewardAgentsClient.createRewardAgent({
            id: faker.string.uuid(),
            referralCode: rewardAgent3?.code,
          })

          await rewardAgentsClient.addRewardAgentMetadata({
            rewardAgentId: rewardAgent4?.id,
            metadata: Struct.fromJson({
              allow: true,
            }),
          })

          const { result: rewardAgent5 } = await rewardAgentsClient.createRewardAgent({
            id: faker.string.uuid(),
            referralCode: rewardAgent4?.code,
          })

          await rewardAgentsClient.addRewardAgentMetadata({
            rewardAgentId: rewardAgent5?.id,
            metadata: Struct.fromJson({
              allow: true,
            }),
          })

          const { result: rewardAgent6 } = await rewardAgentsClient.createRewardAgent({
            id: faker.string.uuid(),
            referralCode: rewardAgent5?.code,
          })

          await rewardAgentsClient.addRewardAgentMetadata({
            rewardAgentId: rewardAgent6?.id,
            metadata: Struct.fromJson({
              allow: true,
            }),
          })

          await rewardOperationsClient.createAndConfirmRewardOperation({
            rewardProgram: rewardProgramCode,
            referrerId: rewardAgent6!.id,
            sourceId: faker.string.uuid(),
            sourceType: faker.word.sample(),
            amount: 100,
          })

          rewardAgent1Id = rewardAgent1!.id
          rewardAgent2Id = rewardAgent2!.id
          rewardAgent3Id = rewardAgent3!.id
          rewardAgent4Id = rewardAgent4!.id
          rewardAgent5Id = rewardAgent5!.id
          rewardAgent6Id = rewardAgent6!.id
        })

        it('check agent 5 rewards', async () => {
          const { rewards } = await rewardOperationsClient.listRewards({
            query: {
              agentId: {
                conditions: {
                  eq: {
                    value: rewardAgent5Id,
                  },
                },
              },
            },
          })

          expect(rewards.at(0)?.referrerId).toBe(rewardAgent6Id)
          expect(rewards.at(0)?.amount).toBe(100)
          expect(rewards.at(0)?.percentage).toBe(40)
          expect(rewards.at(0)?.profit).toBe(40)
          expect(rewards.at(0)?.level).toBe(1)
        })

        it('check agent 4 rewards', async () => {
          const { rewards } = await rewardOperationsClient.listRewards({
            query: {
              agentId: {
                conditions: {
                  eq: {
                    value: rewardAgent4Id,
                  },
                },
              },
            },
          })

          expect(rewards.at(0)?.referrerId).toBe(rewardAgent6Id)
          expect(rewards.at(0)?.amount).toBe(100)
          expect(rewards.at(0)?.percentage).toBe(20)
          expect(rewards.at(0)?.profit).toBe(20)
          expect(rewards.at(0)?.level).toBe(2)
        })

        it('check agent 3 rewards', async () => {
          const { rewards } = await rewardOperationsClient.listRewards({
            query: {
              agentId: {
                conditions: {
                  eq: {
                    value: rewardAgent3Id,
                  },
                },
              },
            },
          })

          expect(rewards.at(0)?.referrerId).toBe(rewardAgent6Id)
          expect(rewards.at(0)?.amount).toBe(100)
          expect(rewards.at(0)?.percentage).toBe(20)
          expect(rewards.at(0)?.profit).toBe(20)
          expect(rewards.at(0)?.level).toBe(3)
        })

        it('check agent 2 rewards', async () => {
          const { rewards } = await rewardOperationsClient.listRewards({
            query: {
              agentId: {
                conditions: {
                  eq: {
                    value: rewardAgent2Id,
                  },
                },
              },
            },
          })

          expect(rewards.at(0)?.referrerId).toBe(rewardAgent6Id)
          expect(rewards.at(0)?.amount).toBe(100)
          expect(rewards.at(0)?.percentage).toBe(10)
          expect(rewards.at(0)?.profit).toBe(10)
          expect(rewards.at(0)?.level).toBe(4)
        })

        it('check agent 1 rewards', async () => {
          const { rewards } = await rewardOperationsClient.listRewards({
            query: {
              agentId: {
                conditions: {
                  eq: {
                    value: rewardAgent1Id,
                  },
                },
              },
            },
          })

          expect(rewards.at(0)?.referrerId).toBe(rewardAgent6Id)
          expect(rewards.at(0)?.amount).toBe(100)
          expect(rewards.at(0)?.percentage).toBe(10)
          expect(rewards.at(0)?.profit).toBe(10)
          expect(rewards.at(0)?.level).toBe(5)
        })

        it('check balances calculated', async () => {
          const balances = await retry(async () => {
            const { rewardPointsBalances } = await rewardPointsClient.listRewardPointsBalances({
              query: {
                id: {
                  conditions: {
                    in: {
                      values: [
                        rewardAgent5Id,
                        rewardAgent4Id,
                        rewardAgent3Id,
                        rewardAgent2Id,
                        rewardAgent1Id,
                      ],
                    },
                  },
                },
              },
            })

            if (rewardPointsBalances.length !== 5) {
              throw new Error('Not updated')
            }

            return rewardPointsBalances
          })

          expect(balances.length).toBe(5)
        })

        it('check agent 5 balance', async () => {
          const { rewardPointsBalances } = await rewardPointsClient.listRewardPointsBalances({
            query: {
              id: {
                conditions: {
                  eq: {
                    value: rewardAgent5Id,
                  },
                },
              },
            },
          })

          expect(rewardPointsBalances.at(0)?.amount).toBe(40)
        })

        it('check agent 4 balance', async () => {
          const { rewardPointsBalances } = await rewardPointsClient.listRewardPointsBalances({
            query: {
              id: {
                conditions: {
                  eq: {
                    value: rewardAgent4Id,
                  },
                },
              },
            },
          })

          expect(rewardPointsBalances.at(0)?.amount).toBe(20)
        })

        it('check agent 3 balance', async () => {
          const { rewardPointsBalances } = await rewardPointsClient.listRewardPointsBalances({
            query: {
              id: {
                conditions: {
                  eq: {
                    value: rewardAgent3Id,
                  },
                },
              },
            },
          })

          expect(rewardPointsBalances.at(0)?.amount).toBe(20)
        })

        it('check agent 2 balance', async () => {
          const { rewardPointsBalances } = await rewardPointsClient.listRewardPointsBalances({
            query: {
              id: {
                conditions: {
                  eq: {
                    value: rewardAgent2Id,
                  },
                },
              },
            },
          })

          expect(rewardPointsBalances.at(0)?.amount).toBe(10)
        })

        it('check agent 1 balance', async () => {
          const { rewardPointsBalances } = await rewardPointsClient.listRewardPointsBalances({
            query: {
              id: {
                conditions: {
                  eq: {
                    value: rewardAgent1Id,
                  },
                },
              },
            },
          })

          expect(rewardPointsBalances.at(0)?.amount).toBe(10)
        })
      })

      describe('check reward partial', () => {
        let rewardAgent1Id: string
        let rewardAgent2Id: string
        let rewardAgent3Id: string
        let rewardAgent4Id: string
        let rewardAgent5Id: string
        let rewardAgent6Id: string

        beforeAll(async () => {
          const { result: rewardAgent1 } = await rewardAgentsClient.createRewardAgent({
            id: faker.string.uuid(),
          })

          await rewardAgentsClient.addRewardAgentMetadata({
            rewardAgentId: rewardAgent1?.id,
            metadata: Struct.fromJson({
              allow: true,
            }),
          })

          const { result: rewardAgent2 } = await rewardAgentsClient.createRewardAgent({
            id: faker.string.uuid(),
            referralCode: rewardAgent1?.code,
          })

          const { result: rewardAgent3 } = await rewardAgentsClient.createRewardAgent({
            id: faker.string.uuid(),
            referralCode: rewardAgent2?.code,
          })

          await rewardAgentsClient.addRewardAgentMetadata({
            rewardAgentId: rewardAgent3?.id,
            metadata: Struct.fromJson({
              allow: true,
            }),
          })

          const { result: rewardAgent4 } = await rewardAgentsClient.createRewardAgent({
            id: faker.string.uuid(),
            referralCode: rewardAgent3?.code,
          })

          const { result: rewardAgent5 } = await rewardAgentsClient.createRewardAgent({
            id: faker.string.uuid(),
            referralCode: rewardAgent4?.code,
          })

          await rewardAgentsClient.addRewardAgentMetadata({
            rewardAgentId: rewardAgent5?.id,
            metadata: Struct.fromJson({
              allow: true,
            }),
          })

          const { result: rewardAgent6 } = await rewardAgentsClient.createRewardAgent({
            id: faker.string.uuid(),
            referralCode: rewardAgent5?.code,
          })

          await rewardAgentsClient.addRewardAgentMetadata({
            rewardAgentId: rewardAgent6?.id,
            metadata: Struct.fromJson({
              allow: true,
            }),
          })

          await rewardOperationsClient.createAndConfirmRewardOperation({
            rewardProgram: rewardProgramCode,
            referrerId: rewardAgent6!.id,
            sourceId: faker.string.uuid(),
            sourceType: faker.word.sample(),
            amount: 100,
          })

          rewardAgent1Id = rewardAgent1!.id
          rewardAgent2Id = rewardAgent2!.id
          rewardAgent3Id = rewardAgent3!.id
          rewardAgent4Id = rewardAgent4!.id
          rewardAgent5Id = rewardAgent5!.id
          rewardAgent6Id = rewardAgent6!.id
        })

        it('check agent 5 rewards', async () => {
          const { rewards } = await rewardOperationsClient.listRewards({
            query: {
              agentId: {
                conditions: {
                  eq: {
                    value: rewardAgent5Id,
                  },
                },
              },
            },
          })

          expect(rewards.at(0)?.referrerId).toBe(rewardAgent6Id)
          expect(rewards.at(0)?.amount).toBe(100)
          expect(rewards.at(0)?.percentage).toBe(40)
          expect(rewards.at(0)?.profit).toBe(40)
          expect(rewards.at(0)?.level).toBe(1)
        })

        it('check agent 4 rewards', async () => {
          const { rewards } = await rewardOperationsClient.listRewards({
            query: {
              agentId: {
                conditions: {
                  eq: {
                    value: rewardAgent4Id,
                  },
                },
              },
            },
          })

          expect(rewards.at(0)).toBeUndefined()
        })

        it('check agent 3 rewards', async () => {
          const { rewards } = await rewardOperationsClient.listRewards({
            query: {
              agentId: {
                conditions: {
                  eq: {
                    value: rewardAgent3Id,
                  },
                },
              },
            },
          })

          expect(rewards.at(0)?.referrerId).toBe(rewardAgent6Id)
          expect(rewards.at(0)?.amount).toBe(100)
          expect(rewards.at(0)?.percentage).toBe(20)
          expect(rewards.at(0)?.profit).toBe(20)
          expect(rewards.at(0)?.level).toBe(3)
        })

        it('check agent 2 rewards', async () => {
          const { rewards } = await rewardOperationsClient.listRewards({
            query: {
              agentId: {
                conditions: {
                  eq: {
                    value: rewardAgent2Id,
                  },
                },
              },
            },
          })

          expect(rewards.at(0)).toBeUndefined()
        })

        it('check agent 1 rewards', async () => {
          const { rewards } = await rewardOperationsClient.listRewards({
            query: {
              agentId: {
                conditions: {
                  eq: {
                    value: rewardAgent1Id,
                  },
                },
              },
            },
          })

          expect(rewards.at(0)?.referrerId).toBe(rewardAgent6Id)
          expect(rewards.at(0)?.amount).toBe(100)
          expect(rewards.at(0)?.percentage).toBe(10)
          expect(rewards.at(0)?.profit).toBe(10)
          expect(rewards.at(0)?.level).toBe(5)
        })

        it('check balances calculated', async () => {
          const balances = await retry(async () => {
            const { rewardPointsBalances } = await rewardPointsClient.listRewardPointsBalances({
              query: {
                id: {
                  conditions: {
                    in: {
                      values: [rewardAgent5Id, rewardAgent3Id, rewardAgent1Id],
                    },
                  },
                },
              },
            })

            if (rewardPointsBalances.length !== 3) {
              throw new Error('Not updated')
            }

            return rewardPointsBalances
          })

          expect(balances.length).toBe(3)
        })

        it('check agent 5 balance', async () => {
          const { rewardPointsBalances } = await rewardPointsClient.listRewardPointsBalances({
            query: {
              id: {
                conditions: {
                  eq: {
                    value: rewardAgent5Id,
                  },
                },
              },
            },
          })

          expect(rewardPointsBalances.at(0)?.amount).toBe(40)
        })

        it('check agent 4 balance', async () => {
          const { rewardPointsBalances } = await rewardPointsClient.listRewardPointsBalances({
            query: {
              id: {
                conditions: {
                  eq: {
                    value: rewardAgent4Id,
                  },
                },
              },
            },
          })

          expect(rewardPointsBalances.at(0)).toBeUndefined()
        })

        it('check agent 3 balance', async () => {
          const { rewardPointsBalances } = await rewardPointsClient.listRewardPointsBalances({
            query: {
              id: {
                conditions: {
                  eq: {
                    value: rewardAgent3Id,
                  },
                },
              },
            },
          })

          expect(rewardPointsBalances.at(0)?.amount).toBe(20)
        })

        it('check agent 2 balance', async () => {
          const { rewardPointsBalances } = await rewardPointsClient.listRewardPointsBalances({
            query: {
              id: {
                conditions: {
                  eq: {
                    value: rewardAgent2Id,
                  },
                },
              },
            },
          })

          expect(rewardPointsBalances.at(0)).toBeUndefined()
        })

        it('check agent 1 balance', async () => {
          const { rewardPointsBalances } = await rewardPointsClient.listRewardPointsBalances({
            query: {
              id: {
                conditions: {
                  eq: {
                    value: rewardAgent1Id,
                  },
                },
              },
            },
          })

          expect(rewardPointsBalances.at(0)?.amount).toBe(10)
        })
      })
    })
  })
})

/* eslint-disable @typescript-eslint/consistent-type-imports */

import type { RewardAgent }                    from '@rewards-system/domain-module'
import type { FindRewardAgentsByQueryResult }  from '@rewards-system/domain-module'
import type { ServiceImpl }                    from '@rewards-system/rewards-system-rpc'
import type { AddRewardAgentMetadataRequest }  from '@rewards-system/rewards-system-rpc/interfaces'
import type { AddRewardAgentMetadataResponse } from '@rewards-system/rewards-system-rpc/interfaces'
import type { ListRewardAgentsRequest }        from '@rewards-system/rewards-system-rpc/interfaces'
import type { ListRewardAgentsResponse }       from '@rewards-system/rewards-system-rpc/interfaces'
import type { GetRewardAgentNetworkRequest }   from '@rewards-system/rewards-system-rpc/interfaces'
import type { GetRewardAgentNetworkResponse }  from '@rewards-system/rewards-system-rpc/interfaces'
import type { CreateRewardAgentRequest }       from '@rewards-system/rewards-system-rpc/interfaces'
import type { CreateRewardAgentResponse }      from '@rewards-system/rewards-system-rpc/interfaces'

import { UseFilters }                          from '@nestjs/common'
import { Controller }                          from '@nestjs/common'
import { QueryBus }                            from '@nestjs/cqrs'
import { CommandBus }                          from '@nestjs/cqrs'
import { Validator }                           from '@monstrs/nestjs-validation'
import { BufExceptionsFilter }                 from '@monstrs/nestjs-buf-errors'
import { BufMethod }                           from '@wolfcoded/nestjs-bufconnect'
import { BufService }                          from '@wolfcoded/nestjs-bufconnect'

import { RewardAgentsService }                 from '@rewards-system/rewards-system-rpc/connect'
import { GetRewardAgentsQuery }                from '@rewards-system/application-module'
import { GetRewardAgentByIdQuery }             from '@rewards-system/application-module'
import { GetRewardAgentNetworkByIdQuery }      from '@rewards-system/application-module'
import { CreateRewardAgentCommand }            from '@rewards-system/application-module'
import { AddRewardAgentMetadataCommand }       from '@rewards-system/application-module'

import { ListRewardAgentsPayload }             from '../payloads/index.js'
import { GetRewardAgentNetworkPayload }        from '../payloads/index.js'
import { CreateRewardAgentPayload }            from '../payloads/index.js'
import { AddRewardAgentMetadataPayload }       from '../payloads/index.js'
import { ListRewardAgentsSerializer }          from '../serializers/index.js'
import { CreateRewardAgentSerializer }         from '../serializers/index.js'
import { AddRewardAgentMetadataSerializer }    from '../serializers/index.js'
import { GetRewardAgentNetworkSerializer }     from '../serializers/index.js'

@Controller()
@BufService(RewardAgentsService)
@UseFilters(BufExceptionsFilter)
export class RewardAgentsController implements ServiceImpl<typeof RewardAgentsService> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly validator: Validator
  ) {}

  @BufMethod()
  async createRewardAgent(request: CreateRewardAgentRequest): Promise<CreateRewardAgentResponse> {
    const payload = new CreateRewardAgentPayload(request)

    await this.validator.validate(payload)

    const command = new CreateRewardAgentCommand(payload.id, payload.referralCode)

    await this.commandBus.execute(command)

    return new CreateRewardAgentSerializer(
      await this.queryBus.execute<GetRewardAgentByIdQuery, RewardAgent>(
        new GetRewardAgentByIdQuery(command.id)
      )
    )
  }

  @BufMethod()
  async addRewardAgentMetadata(
    request: AddRewardAgentMetadataRequest
  ): Promise<AddRewardAgentMetadataResponse> {
    const payload = new AddRewardAgentMetadataPayload(request)

    await this.validator.validate(payload)

    const command = new AddRewardAgentMetadataCommand(payload.rewardAgentId, payload.metadata)

    await this.commandBus.execute(command)

    return new AddRewardAgentMetadataSerializer(
      await this.queryBus.execute<GetRewardAgentByIdQuery, RewardAgent>(
        new GetRewardAgentByIdQuery(command.rewardAgentId)
      )
    )
  }

  @BufMethod()
  async listRewardAgents(request: ListRewardAgentsRequest): Promise<ListRewardAgentsResponse> {
    const payload = new ListRewardAgentsPayload(request)

    await this.validator.validate(payload)

    return new ListRewardAgentsSerializer(
      await this.queryBus.execute<GetRewardAgentsQuery, FindRewardAgentsByQueryResult>(
        new GetRewardAgentsQuery(payload.pager, payload.order, payload.query)
      )
    )
  }

  @BufMethod()
  async getRewardAgentNetwork(
    request: GetRewardAgentNetworkRequest
  ): Promise<GetRewardAgentNetworkResponse> {
    const payload = new GetRewardAgentNetworkPayload(request)

    await this.validator.validate(payload)

    return new GetRewardAgentNetworkSerializer(
      await this.queryBus.execute<GetRewardAgentNetworkByIdQuery, Array<RewardAgent>>(
        new GetRewardAgentNetworkByIdQuery(payload.rewardAgentId)
      )
    )
  }
}

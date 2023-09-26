/* eslint-disable @typescript-eslint/consistent-type-imports */

import type { ServiceImpl }                    from '@connectrpc/connect'
import type { RewardAgent }                    from '@rewards-system/domain-module'
import type { FindRewardAgentsByQueryResult }  from '@rewards-system/domain-module'
import type { AddRewardAgentMetadataRequest }  from '@rewards-system/rewards-rpc/interfaces'
import type { AddRewardAgentMetadataResponse } from '@rewards-system/rewards-rpc/interfaces'
import type { ListRewardAgentsRequest }        from '@rewards-system/rewards-rpc/interfaces'
import type { ListRewardAgentsResponse }       from '@rewards-system/rewards-rpc/interfaces'
import type { GetRewardAgentNetworkRequest }   from '@rewards-system/rewards-rpc/interfaces'
import type { GetRewardAgentNetworkResponse }  from '@rewards-system/rewards-rpc/interfaces'
import type { CreateRewardAgentRequest }       from '@rewards-system/rewards-rpc/interfaces'
import type { CreateRewardAgentResponse }      from '@rewards-system/rewards-rpc/interfaces'

import { ConnectRpcMethod }                    from '@monstrs/nestjs-connectrpc'
import { ConnectRpcService }                   from '@monstrs/nestjs-connectrpc'
import { ConnectRpcExceptionsFilter }          from '@monstrs/nestjs-connectrpc-errors'
import { Validator }                           from '@monstrs/nestjs-validation'
import { UseFilters }                          from '@nestjs/common'
import { Controller }                          from '@nestjs/common'
import { QueryBus }                            from '@nestjs/cqrs'
import { CommandBus }                          from '@nestjs/cqrs'

import { GetRewardAgentsQuery }                from '@rewards-system/application-module'
import { GetRewardAgentByIdQuery }             from '@rewards-system/application-module'
import { GetRewardAgentNetworkByIdQuery }      from '@rewards-system/application-module'
import { CreateRewardAgentCommand }            from '@rewards-system/application-module'
import { AddRewardAgentMetadataCommand }       from '@rewards-system/application-module'
import { RewardAgentsService }                 from '@rewards-system/rewards-rpc/connect'

import { ListRewardAgentsPayload }             from '../payloads/index.js'
import { GetRewardAgentNetworkPayload }        from '../payloads/index.js'
import { CreateRewardAgentPayload }            from '../payloads/index.js'
import { AddRewardAgentMetadataPayload }       from '../payloads/index.js'
import { ListRewardAgentsSerializer }          from '../serializers/index.js'
import { CreateRewardAgentSerializer }         from '../serializers/index.js'
import { AddRewardAgentMetadataSerializer }    from '../serializers/index.js'
import { GetRewardAgentNetworkSerializer }     from '../serializers/index.js'

@Controller()
@ConnectRpcService(RewardAgentsService)
@UseFilters(ConnectRpcExceptionsFilter)
export class RewardAgentsController implements ServiceImpl<typeof RewardAgentsService> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly validator: Validator
  ) {}

  @ConnectRpcMethod()
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

  @ConnectRpcMethod()
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

  @ConnectRpcMethod()
  async listRewardAgents(request: ListRewardAgentsRequest): Promise<ListRewardAgentsResponse> {
    const payload = new ListRewardAgentsPayload(request)

    await this.validator.validate(payload)

    return new ListRewardAgentsSerializer(
      await this.queryBus.execute<GetRewardAgentsQuery, FindRewardAgentsByQueryResult>(
        new GetRewardAgentsQuery(payload.pager, payload.order, payload.query)
      )
    )
  }

  @ConnectRpcMethod()
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

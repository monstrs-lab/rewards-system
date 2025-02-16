import type { ServiceImpl }                             from '@connectrpc/connect'
import type { FindQuestRewardsByQueryResult }           from '@rewards-system/domain-module'
import type { QuestReward }                             from '@rewards-system/domain-module'
import type { RewardOperation }                         from '@rewards-system/domain-module'
import type { FindRewardsByQueryResult }                from '@rewards-system/domain-module'
import type { FindRewardOperationsByQueryResult }       from '@rewards-system/domain-module'
import type { ListRewardsRequest }                      from '@rewards-system/rewards-rpc/interfaces'
import type { ListRewardsResponse }                     from '@rewards-system/rewards-rpc/interfaces'
import type { ListRewardOperationsRequest }             from '@rewards-system/rewards-rpc/interfaces'
import type { ListRewardOperationsResponse }            from '@rewards-system/rewards-rpc/interfaces'
import type { CreateRewardOperationRequest }            from '@rewards-system/rewards-rpc/interfaces'
import type { CreateRewardOperationResponse }           from '@rewards-system/rewards-rpc/interfaces'
import type { ConfirmRewardOperationRequest }           from '@rewards-system/rewards-rpc/interfaces'
import type { ConfirmRewardOperationResponse }          from '@rewards-system/rewards-rpc/interfaces'
import type { CreateAndConfirmRewardOperationRequest }  from '@rewards-system/rewards-rpc/interfaces'
import type { CreateAndConfirmRewardOperationResponse } from '@rewards-system/rewards-rpc/interfaces'
import type { CreateAndConfirmQuestRewardRequest }      from '@rewards-system/rewards-rpc/interfaces'
import type { CreateAndConfirmQuestRewardResponse }     from '@rewards-system/rewards-rpc/interfaces'
import type { ListQuestRewardsRequest }                 from '@rewards-system/rewards-rpc/interfaces'
import type { ListQuestRewardsResponse }                from '@rewards-system/rewards-rpc/interfaces'

import { ConnectRpcMethod }                             from '@monstrs/nestjs-connectrpc'
import { ConnectRpcService }                            from '@monstrs/nestjs-connectrpc'
import { ConnectRpcExceptionsFilter }                   from '@monstrs/nestjs-connectrpc-errors'
import { Validator }                                    from '@monstrs/nestjs-validation'
import { UseFilters }                                   from '@nestjs/common'
import { Controller }                                   from '@nestjs/common'
import { QueryBus }                                     from '@nestjs/cqrs'
import { CommandBus }                                   from '@nestjs/cqrs'
import { v4 as uuid }                                   from 'uuid'

import { GetRewardsQuery }                              from '@rewards-system/application-module'
import { CreateAndConfirmQuestRewardCommand }           from '@rewards-system/application-module'
import { GetQuestRewardByIdQuery }                      from '@rewards-system/application-module'
import { GetQuestRewardsQuery }                         from '@rewards-system/application-module'
import { GetRewardOperationsQuery }                     from '@rewards-system/application-module'
import { GetRewardOperationByIdQuery }                  from '@rewards-system/application-module'
import { CreateRewardOperationCommand }                 from '@rewards-system/application-module'
import { ConfirmRewardOperationCommand }                from '@rewards-system/application-module'
import { CreateAndConfirmRewardOperationCommand }       from '@rewards-system/application-module'
import { RewardOperationsService }                      from '@rewards-system/rewards-rpc/connect'

import { ListRewardsPayload }                           from '../payloads/index.js'
import { CreateAndConfirmQuestRewardPayload }           from '../payloads/index.js'
import { ListQuestRewardsPayload }                      from '../payloads/index.js'
import { ListRewardOperationsPayload }                  from '../payloads/index.js'
import { CreateRewardOperationPayload }                 from '../payloads/index.js'
import { ConfirmRewardOperationPayload }                from '../payloads/index.js'
import { CreateAndConfirmRewardOperationPayload }       from '../payloads/index.js'
import { ListRewardsSerializer }                        from '../serializers/index.js'
import { ListRewardOperationsSerializer }               from '../serializers/index.js'
import { CreateRewardOperationSerializer }              from '../serializers/index.js'
import { ConfirmRewardOperationSerializer }             from '../serializers/index.js'
import { CreateAndConfirmRewardOperationSerializer }    from '../serializers/index.js'
import { CreateAndConfirmQuestRewardSerializer }        from '../serializers/index.js'
import { ListQuestRewardsSerializer }                   from '../serializers/index.js'

@Controller()
@ConnectRpcService(RewardOperationsService)
@UseFilters(ConnectRpcExceptionsFilter)
export class RewardOperationsController implements ServiceImpl<typeof RewardOperationsService> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly validator: Validator
  ) {}

  @ConnectRpcMethod()
  async createRewardOperation(
    request: CreateRewardOperationRequest
  ): Promise<CreateRewardOperationResponse> {
    const payload = new CreateRewardOperationPayload(request)

    await this.validator.validate(payload)

    const command = new CreateRewardOperationCommand(
      uuid(),
      payload.rewardProgram,
      payload.referrerId,
      payload.sourceId,
      payload.sourceType,
      payload.amount
    )

    await this.commandBus.execute(command)

    return new CreateRewardOperationSerializer(
      await this.queryBus.execute<GetRewardOperationByIdQuery, RewardOperation>(
        new GetRewardOperationByIdQuery(command.rewardOperationId)
      )
    )
  }

  @ConnectRpcMethod()
  async createAndConfirmRewardOperation(
    request: CreateAndConfirmRewardOperationRequest
  ): Promise<CreateAndConfirmRewardOperationResponse> {
    const payload = new CreateAndConfirmRewardOperationPayload(request)

    await this.validator.validate(payload)

    const command = new CreateAndConfirmRewardOperationCommand(
      uuid(),
      payload.rewardProgram,
      payload.referrerId,
      payload.sourceId,
      payload.sourceType,
      payload.amount
    )

    await this.commandBus.execute(command)

    return new CreateAndConfirmRewardOperationSerializer(
      await this.queryBus.execute<GetRewardOperationByIdQuery, RewardOperation>(
        new GetRewardOperationByIdQuery(command.rewardOperationId)
      )
    )
  }

  @ConnectRpcMethod()
  async confirmRewardOperation(
    request: ConfirmRewardOperationRequest
  ): Promise<ConfirmRewardOperationResponse> {
    const payload = new ConfirmRewardOperationPayload(request)

    await this.validator.validate(payload)

    const command = new ConfirmRewardOperationCommand(payload.rewardOperationId)

    await this.commandBus.execute(command)

    return new ConfirmRewardOperationSerializer(
      await this.queryBus.execute<GetRewardOperationByIdQuery, RewardOperation>(
        new GetRewardOperationByIdQuery(command.rewardOperationId)
      )
    )
  }

  @ConnectRpcMethod()
  async createAndConfirmQuestReward(
    request: CreateAndConfirmQuestRewardRequest
  ): Promise<CreateAndConfirmQuestRewardResponse> {
    const payload = new CreateAndConfirmQuestRewardPayload(request)

    await this.validator.validate(payload)

    const command = new CreateAndConfirmQuestRewardCommand(
      uuid(),
      payload.recipientId,
      payload.sourceId,
      payload.sourceType,
      payload.amount
    )

    await this.commandBus.execute(command)

    return new CreateAndConfirmQuestRewardSerializer(
      await this.queryBus.execute<GetQuestRewardByIdQuery, QuestReward>(
        new GetQuestRewardByIdQuery(command.questRewardId)
      )
    )
  }

  @ConnectRpcMethod()
  async listRewardOperations(
    request: ListRewardOperationsRequest
  ): Promise<ListRewardOperationsResponse> {
    const payload = new ListRewardOperationsPayload(request)

    await this.validator.validate(payload)

    return new ListRewardOperationsSerializer(
      await this.queryBus.execute<GetRewardOperationsQuery, FindRewardOperationsByQueryResult>(
        new GetRewardOperationsQuery(payload.pager, payload.order, payload.query)
      )
    )
  }

  @ConnectRpcMethod()
  async listRewards(request: ListRewardsRequest): Promise<ListRewardsResponse> {
    const payload = new ListRewardsPayload(request)

    await this.validator.validate(payload)

    return new ListRewardsSerializer(
      await this.queryBus.execute<GetRewardsQuery, FindRewardsByQueryResult>(
        new GetRewardsQuery(payload.pager, payload.order, payload.query)
      )
    )
  }

  @ConnectRpcMethod()
  async listQuestRewards(request: ListQuestRewardsRequest): Promise<ListQuestRewardsResponse> {
    const payload = new ListQuestRewardsPayload(request)

    await this.validator.validate(payload)

    return new ListQuestRewardsSerializer(
      await this.queryBus.execute<GetQuestRewardsQuery, FindQuestRewardsByQueryResult>(
        new GetQuestRewardsQuery(payload.pager, payload.order, payload.query)
      )
    )
  }
}

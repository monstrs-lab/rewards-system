import type { Response }             from 'express'

import { Logger }                    from '@monstrs/logger'
import { Body }                      from '@nestjs/common'
import { Controller }                from '@nestjs/common'
import { Post }                      from '@nestjs/common'
import { Res }                       from '@nestjs/common'
import { HttpStatus }                from '@nestjs/common'
import { CommandBus }                from '@nestjs/cqrs'
import { QueryBus }                  from '@nestjs/cqrs'

import { CreateRewardAgentCommand }  from '@rewards-system/application-module'
import { GetRewardAgentByCodeQuery } from '@rewards-system/application-module'

interface IdentityBody {
  id: string
  referralCode: string | null
}

interface ValidationMessageText {
  id: number
  text: string
  type: 'validation'
  context: object
}

interface ValidationMessage {
  instance_ptr: string
  messages: Array<ValidationMessageText>
}

@Controller('kratos/registration')
export class RegistrationKratosController {
  #logger = new Logger(RegistrationKratosController.name)

  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Post('before')
  async before(
    @Res({ passthrough: true }) res: Response,
    @Body() body: IdentityBody
  ): Promise<object> {
    const messages: Array<ValidationMessage> = []

    if (body.referralCode) {
      const referrer = await this.queryBus.execute(new GetRewardAgentByCodeQuery(body.referralCode))

      if (!referrer) {
        messages.push({
          instance_ptr: '#/traits/referral/code',
          messages: [
            {
              id: 4000002,
              type: 'validation',
              text: 'Invalid referral code',
              context: {},
            },
          ],
        })
      }
    }

    if (messages.length > 0) {
      res.status(HttpStatus.UNPROCESSABLE_ENTITY)

      return {
        messages,
      }
    }

    return {}
  }

  @Post('after')
  async after(@Body() body: IdentityBody): Promise<object> {
    try {
      const command = new CreateRewardAgentCommand(body.id, body.referralCode || undefined)

      await this.commandBus.execute(command)

      return {}
    } catch (error) {
      if (error instanceof Error) {
        this.#logger.error(error)
      }

      throw error
    }
  }
}

import type { DynamicModule } from '@nestjs/common'

import { Module }             from '@nestjs/common'

import * as commandhandlers   from '../command-handlers/index.js'
import * as eventhandlers     from '../event-handlers/index.js'
import * as queryhandlers     from '../query-handlers/index.js'

@Module({})
export class RewardsSystemApplicationModule {
  static register(): DynamicModule {
    return {
      module: RewardsSystemApplicationModule,
      providers: [
        ...Object.values(commandhandlers),
        ...Object.values(eventhandlers),
        ...Object.values(queryhandlers),
      ],
    }
  }
}

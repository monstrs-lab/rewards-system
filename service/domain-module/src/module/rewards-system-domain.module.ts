import type { DynamicModule } from '@nestjs/common'

import { Module }             from '@nestjs/common'

import * as factories         from '../factories/index.js'

@Module({})
export class RewardsSystemDomainModule {
  static register(): DynamicModule {
    return {
      global: true,
      module: RewardsSystemDomainModule,
      providers: [...Object.values(factories)],
      exports: [...Object.values(factories)],
    }
  }
}

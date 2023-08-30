/* eslint-disable no-param-reassign */

import type { ExtractProperties }              from '@monstrs/base-types'
import type { RewardPointsJournalEntry }       from '@rewards-system/domain-module'

import type { RewardPointsJournalEntryEntity } from '../entities/index.js'

import { Injectable }                          from '@nestjs/common'

import { RewardPointsJournalEntryFactory }     from '@rewards-system/domain-module'
import { RewardPointsTransaction }             from '@rewards-system/domain-module'

import { RewardPointsTransactionEntity }       from '../entities/index.js'

@Injectable()
export class RewardPointsJournalEntryMapper {
  constructor(private readonly factory: RewardPointsJournalEntryFactory) {}

  toDomain(entity: RewardPointsJournalEntryEntity): RewardPointsJournalEntry {
    const properties: Omit<ExtractProperties<RewardPointsJournalEntry>, 'autoCommit'> = {
      id: entity.id,
      bookId: entity.bookId,
      rewardId: entity.rewardId,
      number: entity.number,
      pendingTransactions: [],
      transactions: entity.transactions.getItems().map((transaction) => {
        const transactionProperties: ExtractProperties<RewardPointsTransaction> = {
          id: transaction.id,
          bookId: transaction.bookId,
          account: transaction.account,
          credit: transaction.credit,
          debit: transaction.debit,
        }

        return Object.assign(new RewardPointsTransaction(), transactionProperties)
      }),
    }

    return Object.assign(this.factory.create(), properties)
  }

  toPersistence(
    aggregate: RewardPointsJournalEntry,
    entity: RewardPointsJournalEntryEntity
  ): RewardPointsJournalEntryEntity {
    entity.id = aggregate.id
    entity.bookId = aggregate.bookId
    entity.rewardId = aggregate.rewardId
    entity.number = aggregate.number

    aggregate.transactions.forEach((transaction) => {
      if (entity.transactions.getIdentifiers('id').includes(transaction.id)) {
        entity.transactions.getItems().forEach((transactionEntity) => {
          if (transaction.id === transactionEntity.id) {
            transactionEntity.id = transaction.id
            transactionEntity.bookId = transaction.bookId
            transactionEntity.account = transaction.account
            transactionEntity.credit = transaction.credit
            transactionEntity.debit = transaction.debit
          }
        })
      } else {
        const transactionEntity = new RewardPointsTransactionEntity()

        transactionEntity.id = transaction.id
        transactionEntity.bookId = transaction.bookId
        transactionEntity.account = transaction.account
        transactionEntity.credit = transaction.credit
        transactionEntity.debit = transaction.debit

        entity.transactions.add(transactionEntity)
      }
    })

    return entity
  }
}

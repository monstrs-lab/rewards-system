/* eslint-disable no-param-reassign */

import type { ExtractProperties }              from '@monstrs/base-types'

import type { RewardPointsJournalEntryEntity } from '../entities/index.js'

import { Injectable }                          from '@nestjs/common'
import { BigNumber }                           from 'bignumber.js'

import { RewardPointsJournalEntry }            from '@rewards-system/domain-module'
import { RewardPointsTransaction }             from '@rewards-system/domain-module'

import { RewardPointsTransactionEntity }       from '../entities/index.js'

@Injectable()
export class RewardPointsJournalEntryMapper {
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
          credit: new BigNumber(transaction.credit),
          debit: new BigNumber(transaction.debit),
        }

        return Object.assign(new RewardPointsTransaction(), transactionProperties)
      }),
    }

    return Object.assign(new RewardPointsJournalEntry(), properties)
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
            transactionEntity.credit = transaction.credit.toString()
            transactionEntity.debit = transaction.debit.toString()
          }
        })
      } else {
        const transactionEntity = new RewardPointsTransactionEntity()

        transactionEntity.id = transaction.id
        transactionEntity.bookId = transaction.bookId
        transactionEntity.account = transaction.account
        transactionEntity.credit = transaction.credit.toString()
        transactionEntity.debit = transaction.debit.toString()

        entity.transactions.add(transactionEntity)
      }
    })

    return entity
  }
}

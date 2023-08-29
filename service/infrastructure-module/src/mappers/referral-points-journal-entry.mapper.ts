/* eslint-disable no-param-reassign */

import type { ExtractProperties }                from '@monstrs/base-types'
import type { ReferralPointsJournalEntry }       from '@referral-programs/domain-module'

import type { ReferralPointsJournalEntryEntity } from '../entities/index.js'

import { Injectable }                            from '@nestjs/common'

import { ReferralPointsJournalEntryFactory }     from '@referral-programs/domain-module'
import { ReferralPointsTransaction }             from '@referral-programs/domain-module'

import { ReferralPointsTransactionEntity }       from '../entities/index.js'

@Injectable()
export class ReferralPointsJournalEntryMapper {
  constructor(private readonly factory: ReferralPointsJournalEntryFactory) {}

  toDomain(entity: ReferralPointsJournalEntryEntity): ReferralPointsJournalEntry {
    const properties: Omit<ExtractProperties<ReferralPointsJournalEntry>, 'autoCommit'> = {
      id: entity.id,
      bookId: entity.bookId,
      profitId: entity.profitId,
      number: entity.number,
      pendingTransactions: [],
      transactions: entity.transactions.getItems().map((transaction) => {
        const transactionProperties: ExtractProperties<ReferralPointsTransaction> = {
          id: transaction.id,
          bookId: transaction.bookId,
          account: transaction.account,
          credit: transaction.credit,
          debit: transaction.debit,
        }

        return Object.assign(new ReferralPointsTransaction(), transactionProperties)
      }),
    }

    return Object.assign(this.factory.create(), properties)
  }

  toPersistence(
    aggregate: ReferralPointsJournalEntry,
    entity: ReferralPointsJournalEntryEntity
  ): ReferralPointsJournalEntryEntity {
    entity.id = aggregate.id
    entity.bookId = aggregate.bookId
    entity.profitId = aggregate.profitId
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
        const transactionEntity = new ReferralPointsTransactionEntity()

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

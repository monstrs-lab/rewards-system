import { Migration } from '@mikro-orm/migrations'

export class Migration20230829204050 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      'create table "referral_points_balances" ("id" uuid not null, "amount" numeric(12,2) not null, constraint "referral_points_balances_pkey" primary key ("id"));'
    )

    this.addSql(
      'create table "referral_points_journal_entries" ("id" uuid not null, "book_id" uuid not null, "profit_id" uuid not null, "number" varchar(255) not null, constraint "referral_points_journal_entries_pkey" primary key ("id"));'
    )

    this.addSql(
      'create table "referral_points_transactions" ("id" uuid not null, "book_id" uuid not null, "account" varchar(255) not null, "credit" numeric(12,2) not null, "debit" numeric(12,2) not null, "journal_entry_id" uuid not null, constraint "referral_points_transactions_pkey" primary key ("id"));'
    )

    this.addSql(
      'alter table "referral_points_transactions" add constraint "referral_points_transactions_journal_entry_id_foreign" foreign key ("journal_entry_id") references "referral_points_journal_entries" ("id") on update cascade;'
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      'alter table "referral_points_transactions" drop constraint "referral_points_transactions_journal_entry_id_foreign";'
    )

    this.addSql('drop table if exists "referral_points_balances" cascade;')

    this.addSql('drop table if exists "referral_points_journal_entries" cascade;')

    this.addSql('drop table if exists "referral_points_transactions" cascade;')
  }
}

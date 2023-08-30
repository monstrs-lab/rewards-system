import { Migration } from '@mikro-orm/migrations'

export class Migration20230830162220 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      'create table "reward_agents" ("id" uuid not null, "code" varchar(255) not null, "parent_id" uuid null, "path" ltree null, "metadata" jsonb not null default \'{}\', constraint "reward_agents_pkey" primary key ("id"));'
    )

    this.addSql(
      'create table "rewards" ("id" uuid not null, "status" smallint not null default 0, "operation_id" uuid not null, "agent_id" uuid not null, "referrer_id" uuid not null, "level" int not null, "amount" numeric(12,2) not null, "profit" numeric(12,2) not null, "percentage" int not null, "created_at" timestamptz(0) not null, constraint "rewards_pkey" primary key ("id"));'
    )

    this.addSql(
      'create table "reward_operations" ("id" uuid not null, "reward_program_id" uuid not null, "referrer_id" uuid not null, "status" smallint not null default 0, "source_id" uuid not null, "source_type" varchar(255) not null, "amount" numeric(12,2) not null, "created_at" timestamptz(0) not null, constraint "reward_operations_pkey" primary key ("id"));'
    )

    this.addSql(
      'create table "reward_points_balances" ("id" uuid not null, "amount" numeric(12,2) not null, constraint "reward_points_balances_pkey" primary key ("id"));'
    )

    this.addSql(
      'create table "reward_points_journal_entries" ("id" uuid not null, "book_id" uuid not null, "reward_id" uuid not null, "number" varchar(255) not null, constraint "reward_points_journal_entries_pkey" primary key ("id"));'
    )

    this.addSql(
      'create table "reward_points_transactions" ("id" uuid not null, "book_id" uuid not null, "account" varchar(255) not null, "credit" numeric(12,2) not null, "debit" numeric(12,2) not null, "journal_entry_id" uuid not null, constraint "reward_points_transactions_pkey" primary key ("id"));'
    )

    this.addSql(
      'create table "reward_programs" ("id" uuid not null, "code" varchar(255) not null, "name" varchar(255) not null, "percentage" int not null, constraint "reward_programs_pkey" primary key ("id"));'
    )
    this.addSql(
      'alter table "reward_programs" add constraint "reward_programs_code_unique" unique ("code");'
    )

    this.addSql(
      'create table "reward_program_rules" ("id" uuid not null, "name" varchar(255) not null, "order" int not null, "conditions" jsonb not null default \'{}\', "fields" jsonb not null default \'{}\', "program_id" uuid not null, constraint "reward_program_rules_pkey" primary key ("id"));'
    )

    this.addSql(
      'alter table "reward_points_transactions" add constraint "reward_points_transactions_journal_entry_id_foreign" foreign key ("journal_entry_id") references "reward_points_journal_entries" ("id") on update cascade;'
    )

    this.addSql(
      'alter table "reward_program_rules" add constraint "reward_program_rules_program_id_foreign" foreign key ("program_id") references "reward_programs" ("id") on update cascade;'
    )
  }
}

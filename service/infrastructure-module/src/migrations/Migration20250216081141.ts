import { Migration } from '@mikro-orm/migrations'

export class Migration20250216081141 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "withdrawals" ("id" uuid not null, "owner_id" uuid not null, "amount" numeric(12,2) not null, "created_at" timestamptz(0) not null, constraint "withdrawals_pkey" primary key ("id"));'
    )
  }

  override async down(): Promise<void> {
    this.addSql('drop table if exists "withdrawals" cascade;')
  }
}

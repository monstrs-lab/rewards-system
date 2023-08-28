import { Migration } from '@mikro-orm/migrations'

export class Migration20230828095546 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      'alter table "referral_programs" add constraint "referral_programs_code_unique" unique ("code");'
    )
  }

  override async down(): Promise<void> {
    this.addSql('alter table "referral_programs" drop constraint "referral_programs_code_unique";')
  }
}

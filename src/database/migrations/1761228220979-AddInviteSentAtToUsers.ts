import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInviteSentAtToUsers1761228220979 implements MigrationInterface {
  name = 'AddInviteSentAtToUsers1761228220979';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "invite_sent_at" TIMESTAMP WITH TIME ZONE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "invite_sent_at"`);
  }
}

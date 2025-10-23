import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsFirstLoginToUsers1760962347713 implements MigrationInterface {
  name = 'AddIsFirstLoginToUsers1760962347713';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "is_first_login" boolean NOT NULL DEFAULT true`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_first_login"`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSecureCodeToUsers1761258308485 implements MigrationInterface {
  name = 'AddSecureCodeToUsers1761258308485';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "secure_code" VARCHAR(255)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "secure_code"`);
  }
}

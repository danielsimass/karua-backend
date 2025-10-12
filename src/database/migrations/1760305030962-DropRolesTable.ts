import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropRolesTable1760305030962 implements MigrationInterface {
  name = 'DropRolesTable1760305030962';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "roles" CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}

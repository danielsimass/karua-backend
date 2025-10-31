import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexCustomersHostId1761300000000 implements MigrationInterface {
  name = 'AddIndexCustomersHostId1761300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_customers_host_id ON customers (host_id)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_customers_host_id`);
  }
}

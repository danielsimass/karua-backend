import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateNationalitiesSeed1761300001000 implements MigrationInterface {
  name = 'UpdateNationalitiesSeed1761300001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Remove host_id column if it still exists
    await queryRunner.query(`ALTER TABLE nationalities DROP COLUMN IF EXISTS host_id`);

    // Seed Latin American countries and a few key countries
    const countries = [
      'Argentina',
      'Bolivia',
      'Brazil',
      'Chile',
      'Colombia',
      'Costa Rica',
      'Cuba',
      'Dominican Republic',
      'Ecuador',
      'El Salvador',
      'Guatemala',
      'Haiti',
      'Honduras',
      'Mexico',
      'Nicaragua',
      'Panama',
      'Paraguay',
      'Peru',
      'Uruguay',
      'Venezuela',
      'United States',
      'Canada',
      'Spain',
      'Portugal',
      'United Kingdom',
      'Germany',
      'France',
      'Italy',
      'Japan',
      'China',
      'India',
      'Australia',
    ];

    // Insert countries that are not already present
    for (const country of countries) {
      await queryRunner.query(
        `INSERT INTO nationalities (country)
         SELECT $1::varchar
         WHERE NOT EXISTS (SELECT 1 FROM nationalities WHERE country = $1::varchar)`,
        [country]
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const countries = [
      'Argentina',
      'Bolivia',
      'Brazil',
      'Chile',
      'Colombia',
      'Costa Rica',
      'Cuba',
      'Dominican Republic',
      'Ecuador',
      'El Salvador',
      'Guatemala',
      'Haiti',
      'Honduras',
      'Mexico',
      'Nicaragua',
      'Panama',
      'Paraguay',
      'Peru',
      'Uruguay',
      'Venezuela',
      'United States',
      'Canada',
      'Spain',
      'Portugal',
      'United Kingdom',
      'Germany',
      'France',
      'Italy',
      'Japan',
      'China',
      'India',
      'Australia',
    ];

    // Remove inserted countries
    await queryRunner.query(`DELETE FROM nationalities WHERE country = ANY($1::text[])`, [
      countries,
    ]);

    // Optionally restore the host_id column as nullable for rollback symmetry
    await queryRunner.query(`ALTER TABLE nationalities ADD COLUMN IF NOT EXISTS host_id uuid NULL`);
  }
}

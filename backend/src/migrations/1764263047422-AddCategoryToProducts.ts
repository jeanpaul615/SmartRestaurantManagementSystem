import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCategoryToProducts1764263047422 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_PRODUCT_CATEGORY" ON "products" ("category")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_PRODUCT_CATEGORY"`);
  }
}

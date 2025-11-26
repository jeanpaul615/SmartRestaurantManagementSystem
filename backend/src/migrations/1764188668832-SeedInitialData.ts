import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedInitialData1764188668832 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ==================== INSERTAR USUARIO ADMIN ====================

    await queryRunner.query(`
            INSERT INTO "users" (username, email, password, role, status) 
            VALUES (
                'admin',
                'admin@restaurant.com',
                '$2a$12$CXqpGbuK.NLkNgi/WuGLWOafKzK/lU8M34xLzNLfXguZRuYPRMr3W', 
                'admin',
                'active'
            )
            ON CONFLICT (email) DO NOTHING
        `);

    // ==================== INSERTAR RESTAURANTE PRINCIPAL ====================
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // ==================== ELIMINAR DATOS EN ORDEN INVERSO ====================

    // Eliminar usuario admin
    await queryRunner.query(`DELETE FROM "users" WHERE email = 'admin@restaurant.com'`);

    console.log('✅ Datos iniciales eliminados correctamente');
  }
}

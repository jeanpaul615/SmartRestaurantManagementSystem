import { MigrationInterface, QueryRunner } from 'typeorm';
/**
 * Migration: InitialSchema
 *
 * Purpose: Initial schema for the database
 * Related to: N/A
 * Author: Jean Paul Puerta
 * Date: 26-11-2025
 *
 * Changes: Initial schema creation including enums, tables, foreign keys, and indexes
 *
 * Rollback: Drops all created enums, tables, foreign keys, and indexes
 */

export class InitialSchema1764187056507 implements MigrationInterface {
  name = 'InitialSchema1764187056507';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ==================== CREAR ENUMS ====================

    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'customer', 'waiter', 'chef')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_status_enum" AS ENUM('active', 'inactive')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."reservations_status_enum" AS ENUM('pending', 'confirmed', 'cancelled', 'completed')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tables_status_enum" AS ENUM('available', 'occupied', 'reserved')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_status_enum" AS ENUM('pending', 'in_progress', 'completed', 'cancelled')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."notifications_type_enum" AS ENUM('info', 'warning', 'error', 'success')`,
    );

    // ==================== CREAR TABLAS ====================

    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL NOT NULL, 
                "username" character varying(50) NOT NULL, 
                "email" character varying(100) NOT NULL, 
                "password" character varying(100) NOT NULL, 
                "role" "public"."users_role_enum" NOT NULL DEFAULT 'customer', 
                "status" "public"."users_status_enum" NOT NULL DEFAULT 'active', 
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), 
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "restaurants" (
                "id" SERIAL NOT NULL, 
                "name" character varying(100) NOT NULL, 
                "address" character varying(200) NOT NULL, 
                "phone" character varying(20) NOT NULL, 
                "email" character varying(100), 
                "description" text, 
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
                "userId" integer, 
                CONSTRAINT "PK_e2133a72eb1cc8f588f7b503e68" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "products" (
                "id" SERIAL NOT NULL, 
                "name" character varying(100) NOT NULL, 
                "description" text, 
                "price" numeric(10,2) NOT NULL, 
                "category" character varying(50) NOT NULL, 
                "imageUrl" character varying(255), 
                "available" boolean NOT NULL DEFAULT true, 
                "stock" integer NOT NULL DEFAULT '0', 
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
                "restaurantId" integer, 
                CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "tables" (
                "id" SERIAL NOT NULL, 
                "tableNumber" integer NOT NULL, 
                "capacity" integer NOT NULL, 
                "status" "public"."tables_status_enum" NOT NULL DEFAULT 'available', 
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
                "restaurantId" integer, 
                CONSTRAINT "PK_7cf2aca7af9550742f855d4eb69" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "reservations" (
                "id" SERIAL NOT NULL, 
                "reservationDate" TIMESTAMP NOT NULL, 
                "numberOfGuests" integer NOT NULL, 
                "status" "public"."reservations_status_enum" NOT NULL DEFAULT 'pending', 
                "notes" text, 
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
                "userId" integer, 
                "tableId" integer, 
                "restaurantId" integer, 
                CONSTRAINT "PK_da95cef71b617ac35dc5bcda243" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "orders" (
                "id" SERIAL NOT NULL, 
                "orderNumber" character varying(50) NOT NULL, 
                "totalAmount" numeric(10,2) NOT NULL DEFAULT '0', 
                "status" "public"."orders_status_enum" NOT NULL DEFAULT 'pending', 
                "notes" text, 
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
                "userId" integer, 
                "tableId" integer, 
                "restaurantId" integer, 
                CONSTRAINT "UQ_b48bf5f8c2e35a9b2a4e1e2c66e" UNIQUE ("orderNumber"), 
                CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "order_items" (
                "id" SERIAL NOT NULL, 
                "quantity" integer NOT NULL DEFAULT '1', 
                "unitPrice" numeric(10,2) NOT NULL, 
                "subtotal" numeric(10,2) NOT NULL, 
                "notes" text, 
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
                "orderId" integer, 
                "productId" integer, 
                CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "notifications" (
                "id" SERIAL NOT NULL, 
                "title" character varying(100) NOT NULL, 
                "message" text NOT NULL, 
                "type" "public"."notifications_type_enum" NOT NULL DEFAULT 'info', 
                "isRead" boolean NOT NULL DEFAULT false, 
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
                "userId" integer, 
                CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "refresh_tokens" (
                "id" SERIAL NOT NULL, 
                "token" character varying(500) NOT NULL, 
                "expiresAt" TIMESTAMP NOT NULL, 
                "isRevoked" boolean NOT NULL DEFAULT false, 
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(), 
                "userId" integer, 
                CONSTRAINT "UQ_c4eeb599dc8e1a62e14181e8b91" UNIQUE ("token"), 
                CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id")
            )
        `);

    // ==================== CREAR ÍNDICES ====================

    await queryRunner.query(`CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email")`);
    await queryRunner.query(`CREATE INDEX "IDX_users_role" ON "users" ("role")`);
    await queryRunner.query(`CREATE INDEX "IDX_orders_status" ON "orders" ("status")`);
    await queryRunner.query(`CREATE INDEX "IDX_orders_userId" ON "orders" ("userId")`);
    await queryRunner.query(`CREATE INDEX "IDX_reservations_status" ON "reservations" ("status")`);
    await queryRunner.query(
      `CREATE INDEX "IDX_reservations_date" ON "reservations" ("reservationDate")`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_products_category" ON "products" ("category")`);
    await queryRunner.query(`CREATE INDEX "IDX_products_available" ON "products" ("available")`);
    await queryRunner.query(`CREATE INDEX "IDX_tables_status" ON "tables" ("status")`);

    // ==================== CREAR FOREIGN KEYS ====================

    await queryRunner.query(
      `ALTER TABLE "restaurants" ADD CONSTRAINT "FK_d7f3c7f52fb94fb9a0e43f66a40" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_e3be6d9d6f9e1c5e8f5e6c7f8a9" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tables" ADD CONSTRAINT "FK_f1a2b3c4d5e6f7g8h9i0j1k2l3m" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservations" ADD CONSTRAINT "FK_aa0e1a2b3c4d5e6f7g8h9i0j1k2" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservations" ADD CONSTRAINT "FK_bb1f2g3h4i5j6k7l8m9n0o1p2q3" FOREIGN KEY ("tableId") REFERENCES "tables"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservations" ADD CONSTRAINT "FK_cc2g3h4i5j6k7l8m9n0o1p2q3r4" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_e5d1e4f6g7h8i9j0k1l2m3n4o5p" FOREIGN KEY ("tableId") REFERENCES "tables"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_f6e2f7g8h9i0j1k2l3m4n5o6p7q" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_145532db85752b29c57d2b7b1f1" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_cdb99c05982d5191ac8465ac010" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_610102b60fea1455310ccd299de" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // ==================== ELIMINAR FOREIGN KEYS ====================

    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_610102b60fea1455310ccd299de"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_692a909ee0fa9383e7859f9b406"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_cdb99c05982d5191ac8465ac010"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_145532db85752b29c57d2b7b1f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_f6e2f7g8h9i0j1k2l3m4n5o6p7q"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_e5d1e4f6g7h8i9j0k1l2m3n4o5p"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservations" DROP CONSTRAINT "FK_cc2g3h4i5j6k7l8m9n0o1p2q3r4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservations" DROP CONSTRAINT "FK_bb1f2g3h4i5j6k7l8m9n0o1p2q3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reservations" DROP CONSTRAINT "FK_aa0e1a2b3c4d5e6f7g8h9i0j1k2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tables" DROP CONSTRAINT "FK_f1a2b3c4d5e6f7g8h9i0j1k2l3m"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_e3be6d9d6f9e1c5e8f5e6c7f8a9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurants" DROP CONSTRAINT "FK_d7f3c7f52fb94fb9a0e43f66a40"`,
    );

    // ==================== ELIMINAR ÍNDICES ====================

    await queryRunner.query(`DROP INDEX "public"."IDX_tables_status"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_products_available"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_products_category"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_reservations_date"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_reservations_status"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_orders_userId"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_orders_status"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_users_role"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);

    // ==================== ELIMINAR TABLAS ====================

    await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(`DROP TABLE "order_items"`);
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TABLE "reservations"`);
    await queryRunner.query(`DROP TABLE "tables"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TABLE "restaurants"`);
    await queryRunner.query(`DROP TABLE "users"`);

    // ==================== ELIMINAR ENUMS ====================

    await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."tables_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."reservations_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }
}

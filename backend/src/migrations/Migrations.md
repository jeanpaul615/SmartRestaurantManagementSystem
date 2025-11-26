# 📋 Historial de Migraciones

Este documento registra todas las migraciones de base de datos del proyecto Smart Restaurant Management System.

## 📌 Convenciones

- **Timestamp**: Fecha y hora de creación en formato Unix
- **Estado**: ✅ Aplicada | ⏳ Pendiente | ❌ Revertida
- **Ambiente**: DEV | STAGING | PROD

---

## 🗂️ Índice de Migraciones

| # | Timestamp | Nombre | Estado | Fecha | Ambiente |
|---|-----------|--------|--------|-------|----------|
| 1 | 1764187056507 | InitialSchema | ✅ | 26-11-2025 |  PROD |


---

## 📖 Detalle de Migraciones

### 1️⃣ InitialSchema (1764187056507)

**Fecha:** 26 de Noviembre, 2025  
**Autor:** Jean Paul Puerta  
**Issue:** N/A  
**Estado:** ✅ Aplicada en PROD  

#### Descripción:
Migración inicial que crea el esquema base completo del sistema.

#### Cambios:
- **ENUMs Creados:**
  - `users_role_enum`: admin, customer, waiter, chef
  - `users_status_enum`: active, inactive
  - `reservations_status_enum`: pending, confirmed, cancelled, completed
  - `tables_status_enum`: available, occupied, reserved
  - `orders_status_enum`: pending, in_progress, completed, cancelled
  - `notifications_type_enum`: info, warning, error, success

- **Tablas Creadas:**
  - `users`: Usuarios del sistema
  - `restaurants`: Información de restaurantes
  - `products`: Productos/menú
  - `tables`: Mesas del restaurante
  - `reservations`: Reservaciones de clientes
  - `orders`: Órdenes de clientes
  - `order_items`: Ítems de órdenes
  - `notifications`: Notificaciones del sistema
  - `refresh_tokens`: Tokens JWT de autenticación

- **Índices Creados:**
  - `IDX_97672ac88f789774dd47f7c8be` en `users.email`
  - `IDX_users_role` en `users.role`
  - `IDX_orders_status` en `orders.status`
  - Y más... (ver archivo completo)

- **Relaciones (Foreign Keys):**
  - `restaurants.userId` → `users.id` (CASCADE)
  - `products.restaurantId` → `restaurants.id` (CASCADE)
  - `orders.userId` → `users.id` (SET NULL)
  - Y más... (ver archivo completo)

#### Comandos Ejecutados:
```bash
# Generar migración
npm run migration:generate -- src/migrations/InitialSchema

# Ejecutar en desarrollo
npm run migration:run

# Ejecutar en producción
NODE_ENV=production npm run migration:run
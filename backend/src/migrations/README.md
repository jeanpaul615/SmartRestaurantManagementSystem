
---

## 📄 4. README.md en `/migrations`

```markdown
# 🗂️ Migraciones de Base de Datos

Esta carpeta contiene todas las migraciones de TypeORM del proyecto.

## 🚀 Comandos Rápidos

```bash
# Ver estado de migraciones
npm run migration:show

# Ejecutar migraciones pendientes
npm run migration:run

# Revertir última migración
npm run migration:revert

# Generar nueva migración
npm run migration:generate -- src/migrations/NombreDescriptivo

# Crear migración vacía
npm run migration:create -- src/migrations/NombreDescriptivo
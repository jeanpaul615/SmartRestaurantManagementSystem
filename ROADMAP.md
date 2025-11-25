# 🎯 ROADMAP COMPLETO - SmartRestaurantManagementSystem

## 📊 Estado Actual del Proyecto

```
Backend:       ████████░░ 80% - Funcional pero sin WebSocket/Kafka
Frontend:      ████░░░░░░ 40% - Dashboard admin OK, resto incompleto
Autenticación: ██████████ 100% - Completo y funcional
Base de datos: █████████░ 90% - Bien diseñado, falta migraciones
Tests:         ░░░░░░░░░░ 0% - Sin implementar
DevOps:        ██░░░░░░░░ 20% - Solo scripts básicos
Seguridad:     ██████░░░░ 60% - Básica OK, falta hardening

TOTAL:         ████████░░ 55% - Proyecto sólido, necesita desarrollo frontend
```

---

## 📋 FASE 1: FUNDAMENTOS Y CONFIGURACIÓN

**Duración estimada:** 2 semanas  
**Prioridad:** 🔥 Alta

### 1.1 Configuración de Entorno ⚙️

#### Tareas:
- [ ] Crear archivo `.env.example` con todas las variables necesarias
- [ ] Documentar variables requeridas en README principal
- [ ] Configurar ESLint y Prettier de forma consistente
- [ ] Agregar pre-commit hooks con Husky

#### Archivos a crear:

**backend/.env.example:**
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_password
DB_NAME=restaurant_db

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=8000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Redis (opcional para esta fase)
REDIS_HOST=localhost
REDIS_PORT=6379
```

**frontend/.env.example:**
```env
VITE_API_BASE_URL=/api
VITE_WS_URL=ws://localhost:8000
```

**.husky/pre-commit:**
```bash
#!/bin/sh
npm run lint
npm run type-check
```

---

### 1.2 Dockerización 🐳

#### Tareas:
- [ ] Crear Dockerfile para backend
- [ ] Crear Dockerfile para frontend
- [ ] Crear docker-compose.yml completo
- [ ] Agregar scripts npm para Docker
- [ ] Documentar setup con Docker en README

#### Archivos a crear:

**backend/Dockerfile:**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 8000
CMD ["node", "dist/main.js"]
```

**frontend/Dockerfile:**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: restaurant_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=development
    depends_on:
      - postgres
      - redis
    volumes:
      - ./backend:/app
      - /app/node_modules

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

**Scripts a agregar en package.json:**
```json
{
  "scripts": {
    "docker:build": "docker-compose build",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "docker:logs": "docker-compose logs -f"
  }
}
```

---

### 1.3 Migraciones de Base de Datos 💾

#### Tareas:
- [ ] Cambiar `synchronize: false` en configuración de producción
- [ ] Configurar TypeORM CLI para migraciones
- [ ] Crear migración inicial con esquema actual
- [ ] Agregar scripts para generar/ejecutar migraciones
- [ ] Documentar proceso de migraciones

#### Scripts en backend/package.json:
```json
{
  "scripts": {
    "typeorm": "typeorm-ts-node-commonjs",
    "migration:generate": "npm run typeorm -- migration:generate -d src/config/Database.ts",
    "migration:create": "npm run typeorm -- migration:create",
    "migration:run": "npm run typeorm -- migration:run -d src/config/Database.ts",
    "migration:revert": "npm run typeorm -- migration:revert -d src/config/Database.ts"
  }
}
```

#### Configuración:
```typescript
// backend/src/config/Database.ts
export const DatabaseConfig = TypeOrmModule.forRoot({
  // ... otras configuraciones
  synchronize: process.env.NODE_ENV !== 'production',
  migrations: ['dist/migrations/*.js'],
  migrationsRun: true,
});
```

---

## 🎨 FASE 2: COMPLETAR FRONTEND - PÁGINAS CORE

**Duración estimada:** 3 semanas  
**Prioridad:** 🔥 Alta

### 2.1 Sistema de Gestión de Menú 🍕

#### Backend - Endpoints adicionales:
- [ ] `GET /products/category/:category` - Filtrar por categoría
- [ ] `GET /products/search?q=pizza` - Búsqueda de productos
- [ ] `PATCH /products/:id/toggle-availability` - Cambiar disponibilidad

#### Frontend - Páginas a crear:

**features/menu/pages/MenuListPage.tsx**
- [ ] Lista de productos en grid responsive
- [ ] Filtros por categoría y disponibilidad
- [ ] Búsqueda en tiempo real
- [ ] Botones: Agregar, Editar, Eliminar
- [ ] Paginación

**features/menu/pages/MenuFormPage.tsx**
- [ ] Formulario con React Hook Form
- [ ] Validación con Zod o Yup
- [ ] Campos: nombre, descripción, precio, categoría, stock
- [ ] Upload de imagen (opcional)
- [ ] Submit y manejo de errores

**features/menu/components/**
- [ ] `ProductCard.tsx` - Card individual con imagen y acciones
- [ ] `MenuFilters.tsx` - Componente de filtros
- [ ] `ProductTable.tsx` - Vista de tabla alternativa
- [ ] `CategoryBadge.tsx` - Badge de categoría

#### Hooks personalizados:
```typescript
// features/menu/hooks/useProducts.ts
export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getProducts(filters)
  });
};

// features/menu/hooks/useProductForm.ts
export const useProductForm = () => {
  const mutation = useMutation({
    mutationFn: (data) => productService.createProduct(data)
  });
  // ... lógica del formulario
};
```

---

### 2.2 Gestión de Mesas 🪑

#### Backend - Endpoints mejorados:
- [ ] `GET /tables/restaurant/:id` - Mesas por restaurante
- [ ] `PATCH /tables/:id/status` - Cambiar estado (available, occupied, reserved)
- [ ] `GET /tables/available` - Mesas disponibles con filtros

#### Frontend - Páginas:

**features/tables/pages/TablesGridPage.tsx**
- [ ] Vista de mesas en grid visual
- [ ] Colores por estado: Verde (disponible), Rojo (ocupado), Amarillo (reservado)
- [ ] Click para ver detalles o cambiar estado
- [ ] Filtros por capacidad y estado

**features/tables/pages/TableDetailsPage.tsx**
- [ ] Información de mesa: número, capacidad, ubicación
- [ ] Historial de reservaciones
- [ ] Pedidos activos en la mesa
- [ ] Botón: Asignar nuevo pedido

**features/tables/components/**
- [ ] `TableCard.tsx` - Representación visual de mesa
- [ ] `TableStatusBadge.tsx` - Badge con color según estado
- [ ] `TableGrid.tsx` - Grid de todas las mesas
- [ ] `TableHistory.tsx` - Historial de uso

#### Estilos visuales:
```typescript
const getTableColor = (status: string) => {
  switch(status) {
    case 'available': return 'bg-green-500';
    case 'occupied': return 'bg-red-500';
    case 'reserved': return 'bg-yellow-500';
    case 'maintenance': return 'bg-gray-500';
  }
};
```

---

### 2.3 Sistema de Pedidos 📦

#### Backend - Endpoints completos:
- [ ] `POST /orders` - Crear pedido con items
- [ ] `GET /orders/active` - Pedidos activos (pending, preparing)
- [ ] `GET /orders/history` - Historial con paginación
- [ ] `PATCH /orders/:id/status` - Actualizar estado
- [ ] `GET /orders/table/:tableId` - Pedidos de mesa específica
- [ ] `GET /orders/stats` - Estadísticas (ventas diarias, promedios)
- [ ] `DELETE /orders/:id` - Cancelar pedido

#### Frontend - Módulo completo:

**features/orders/pages/OrdersListPage.tsx**
- [ ] Tabs: Todos, Activos, En preparación, Completados, Cancelados
- [ ] Filtros: fecha, mesa, estado, mesero
- [ ] Búsqueda por número de orden
- [ ] Cards con timeline de estados
- [ ] Acciones rápidas en cada card

**features/orders/pages/CreateOrderPage.tsx**
- [ ] Paso 1: Seleccionar mesa disponible
- [ ] Paso 2: Agregar productos al carrito
- [ ] Paso 3: Revisar y confirmar
- [ ] Buscador de productos con autocompletado
- [ ] Carrito flotante con subtotales
- [ ] Campo de notas especiales
- [ ] Cálculo automático de total + impuestos

**features/orders/pages/OrderDetailsPage.tsx**
- [ ] Header con número de orden y estado
- [ ] Información: mesa, mesero, fecha/hora
- [ ] Lista de items con precios
- [ ] Timeline visual de cambios de estado
- [ ] Botones: Cancelar, Imprimir ticket, Marcar como pagado

**features/orders/components/**
- [ ] `OrderCard.tsx` - Card con resumen
- [ ] `OrderTimeline.tsx` - Línea de tiempo de estados
- [ ] `OrderCart.tsx` - Carrito de compras
- [ ] `OrderItemList.tsx` - Lista de productos del pedido
- [ ] `OrderStatusBadge.tsx` - Badge de estado
- [ ] `ProductSelector.tsx` - Selector de productos con búsqueda

#### Lógica de negocio:
```typescript
// Validaciones al crear orden
- Verificar mesa disponible
- Validar stock de productos
- Calcular totales correctamente
- Actualizar estado de mesa a "occupied"
- Notificar a cocina (WebSocket)
- Generar ticket imprimible
```

---

### 2.4 Panel de Cocina 👨‍🍳

#### Backend - Endpoints específicos:
- [ ] `GET /orders/kitchen/pending` - Pedidos nuevos para cocina
- [ ] `GET /orders/kitchen/preparing` - Pedidos en preparación
- [ ] `PATCH /orders/:id/start-preparation` - Iniciar preparación
- [ ] `PATCH /orders/:id/ready` - Marcar pedido como listo
- [ ] `GET /orders/kitchen/queue` - Cola ordenada por prioridad

#### Frontend - Vista optimizada:

**features/kitchen/pages/KitchenDashboard.tsx**
- [ ] Layout: 3 columnas (Pendientes | En preparación | Listos)
- [ ] Drag & drop entre columnas
- [ ] Sonido de alerta para nuevos pedidos
- [ ] Timer en cada ticket
- [ ] Priorización por tiempo de espera
- [ ] Vista fullscreen para pantallas de cocina

**features/kitchen/components/KitchenTicket.tsx**
- [ ] Ticket grande con número de orden
- [ ] Número de mesa destacado
- [ ] Lista de items con cantidades grandes
- [ ] Notas especiales en rojo
- [ ] Botón grande: "Iniciar" / "Listo"
- [ ] Indicador de tiempo transcurrido
- [ ] Color de urgencia (verde → amarillo → rojo)

**features/kitchen/components/KitchenQueue.tsx**
- [ ] Cola ordenada automáticamente
- [ ] Indicador de prioridad
- [ ] Tiempo estimado de preparación

#### UI/UX especial para cocina:
```typescript
// Características
- Fuente grande para lectura a distancia
- Colores brillantes y contrastantes
- Touch targets grandes para pantallas táctiles
- Sin scroll innecesario
- Actualización en tiempo real (WebSocket)
- Sonido de alerta configurable
```

---

### 2.5 Gestión de Reservaciones 📅

#### Backend - Sistema mejorado:
- [ ] `GET /reservations/calendar` - Vista calendario con disponibilidad
- [ ] `POST /reservations/check-availability` - Verificar disponibilidad en tiempo real
- [ ] `PATCH /reservations/:id/confirm` - Confirmar reservación
- [ ] `PATCH /reservations/:id/cancel` - Cancelar con razón
- [ ] `GET /reservations/upcoming` - Próximas (hoy, esta semana)
- [ ] `POST /reservations/remind` - Enviar recordatorio

#### Frontend - Sistema completo:

**features/reservations/pages/ReservationsCalendar.tsx**
- [ ] Calendario mensual (react-big-calendar o FullCalendar)
- [ ] Eventos coloreados por estado
- [ ] Click en día para ver detalles
- [ ] Indicadores de ocupación por hora
- [ ] Vista día/semana/mes
- [ ] Drag & drop para reagendar

**features/reservations/pages/CreateReservationPage.tsx**
- [ ] Formulario paso a paso
- [ ] Paso 1: Fecha y hora
- [ ] Paso 2: Número de personas
- [ ] Paso 3: Selección de mesa (visual)
- [ ] Paso 4: Datos del cliente (nombre, teléfono, email)
- [ ] Validación de disponibilidad en tiempo real
- [ ] Confirmación visual

**features/reservations/pages/ReservationsList.tsx**
- [ ] Vista de lista con filtros
- [ ] Filtros: estado, fecha, mesa
- [ ] Búsqueda por nombre de cliente
- [ ] Acciones: confirmar, cancelar, editar, eliminar
- [ ] Export a CSV

**features/reservations/components/**
- [ ] `ReservationCard.tsx` - Card con info
- [ ] `ReservationCalendar.tsx` - Componente calendario
- [ ] `TableAvailability.tsx` - Selector visual de mesa
- [ ] `ReservationForm.tsx` - Formulario reutilizable

---

## 🚀 FASE 3: FUNCIONALIDADES AVANZADAS

**Duración estimada:** 3 semanas  
**Prioridad:** ⚡ Media-Alta

### 3.1 WebSocket para Tiempo Real ⚡

#### Backend - Configurar Socket.IO:

**Instalación:**
```bash
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io
```

**Archivo: backend/src/websocket/events.gateway.ts**
```typescript
import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ 
  cors: { 
    origin: 'http://localhost:3000',
    credentials: true 
  } 
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  // Emitir nuevo pedido a cocina
  notifyNewOrder(order: any) {
    this.server.to('kitchen').emit('order:created', order);
  }

  // Notificar cambio de estado de pedido
  notifyOrderStatusChange(orderId: number, status: string) {
    this.server.emit('order:statusChanged', { orderId, status });
  }

  // Notificar cambio de mesa
  notifyTableStatusChange(tableId: number, status: string) {
    this.server.emit('table:statusChanged', { tableId, status });
  }
}
```

#### Eventos a implementar:
- [ ] `order.created` - Nuevo pedido creado
- [ ] `order.statusChanged` - Estado de pedido cambió
- [ ] `order.ready` - Pedido listo para servir
- [ ] `table.statusChanged` - Estado de mesa cambió
- [ ] `reservation.created` - Nueva reservación
- [ ] `reservation.reminder` - Recordatorio de reservación
- [ ] `notification.new` - Nueva notificación

#### Frontend - Conectar WebSocket:

**Instalación:**
```bash
npm install socket.io-client
```

**Archivo: frontend/src/core/websocket/socketClient.ts**
```typescript
import { io, Socket } from 'socket.io-client';

class SocketClient {
  private socket: Socket | null = null;

  connect() {
    this.socket = io('http://localhost:8000', {
      withCredentials: true,
      transports: ['websocket']
    });

    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
    });
  }

  on(event: string, callback: (data: any) => void) {
    this.socket?.on(event, callback);
  }

  emit(event: string, data: any) {
    this.socket?.emit(event, data);
  }

  disconnect() {
    this.socket?.disconnect();
  }
}

export const socketClient = new SocketClient();
```

**Hook personalizado: useWebSocket.ts**
```typescript
import { useEffect } from 'react';
import { socketClient } from './socketClient';

export const useWebSocket = (event: string, callback: (data: any) => void) => {
  useEffect(() => {
    socketClient.on(event, callback);
    
    return () => {
      // Cleanup si es necesario
    };
  }, [event, callback]);
};
```

#### Integración en páginas:
- [ ] **Dashboard**: escuchar `order:created` para actualizar métricas
- [ ] **Kitchen**: escuchar `order:created` para mostrar nuevos tickets
- [ ] **Orders**: escuchar `order:statusChanged` para actualizar vista
- [ ] **Tables**: escuchar `table:statusChanged` para actualizar grid

---

### 3.2 Sistema de Notificaciones 🔔

#### Backend - Implementar BullMQ:

**Instalación:**
```bash
npm install @nestjs/bull bull
npm install @types/bull -D
```

**Configuración: backend/src/config/Queue.ts**
```typescript
import { BullModule } from '@nestjs/bull';

export const QueueConfig = BullModule.forRoot({
  redis: {
    host: 'localhost',
    port: 6379,
  },
});
```

**Archivo: backend/src/notifications/notifications.queue.ts**
```typescript
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('notifications')
export class NotificationsProcessor {
  
  @Process('send-email')
  async handleSendEmail(job: Job) {
    const { email, subject, body } = job.data;
    // Enviar email
  }

  @Process('send-push')
  async handleSendPush(job: Job) {
    const { userId, message } = job.data;
    // Enviar push notification
  }

  @Process('reservation-reminder')
  async handleReservationReminder(job: Job) {
    const { reservationId } = job.data;
    // Enviar recordatorio 1 hora antes
  }
}
```

#### Tipos de notificaciones:
- [ ] Email de confirmación de reservación
- [ ] Notificación cuando pedido está listo
- [ ] Recordatorio de reservación (1 hora antes)
- [ ] Alerta de stock bajo
- [ ] Resumen diario de ventas (admin)

#### Frontend - Centro de notificaciones:

**features/notifications/components/NotificationCenter.tsx**
- [ ] Dropdown en Topbar con icono de campana
- [ ] Badge con número de no leídas
- [ ] Lista scrollable de últimas 10 notificaciones
- [ ] Click para marcar como leída
- [ ] Link a página completa de notificaciones

**features/notifications/pages/NotificationsPage.tsx**
- [ ] Vista completa de todas las notificaciones
- [ ] Filtros: Todas, No leídas, Leídas
- [ ] Categorías: Pedidos, Reservaciones, Sistema
- [ ] Paginación
- [ ] Acciones: Marcar todas como leídas, Eliminar

---

### 3.3 Analíticas y Reportes 📊

#### Backend - Endpoints de estadísticas:

**GET /analytics/sales**
```typescript
{
  "today": { "sales": 1500, "orders": 45 },
  "yesterday": { "sales": 1350, "orders": 42 },
  "thisWeek": { "sales": 9500, "orders": 280 },
  "thisMonth": { "sales": 38000, "orders": 1150 },
  "topProduct": { "name": "Pizza Margherita", "quantity": 85 },
  "topTable": { "number": 5, "revenue": 3500 }
}
```

**GET /analytics/products**
```typescript
{
  "topSelling": [
    { "id": 1, "name": "Pizza", "quantity": 85, "revenue": 1275 }
  ],
  "lowStock": [
    { "id": 5, "name": "Pasta", "stock": 3 }
  ],
  "profitMargin": [
    { "id": 1, "name": "Pizza", "cost": 5, "price": 15, "margin": 67 }
  ]
}
```

**GET /analytics/reservations**
```typescript
{
  "occupancyRate": 78.5,
  "peakHours": ["19:00", "20:00", "21:00"],
  "cancellationRate": 12.3,
  "averagePartySize": 3.5
}
```

#### Frontend - Dashboard de Analytics:

**features/analytics/pages/AnalyticsDashboard.tsx**
- [ ] Selector de período (hoy, semana, mes, año, custom)
- [ ] Gráfico de ventas (línea con Recharts)
- [ ] Gráfico de pedidos por hora (barra)
- [ ] Top 10 productos más vendidos (tabla)
- [ ] Comparativa con período anterior
- [ ] KPIs principales: ventas, pedidos, ticket promedio, ocupación
- [ ] Botón: Exportar reporte (PDF/Excel)

**features/analytics/components/**
- [ ] `SalesChart.tsx` - Gráfico de ventas
- [ ] `OrdersByHourChart.tsx` - Pedidos por hora
- [ ] `TopProductsTable.tsx` - Tabla de top productos
- [ ] `OccupancyRate.tsx` - Medidor de ocupación
- [ ] `RevenueComparison.tsx` - Comparativa de ingresos

---

### 3.4 Gestión de Staff 👥

#### Backend - Endpoints de empleados:

- [ ] `GET /users/staff` - Lista de empleados (con filtros)
- [ ] `PATCH /users/:id/schedule` - Asignar horario
- [ ] `GET /users/staff/active` - Staff activo hoy
- [ ] `POST /users/staff/clock-in` - Marcar entrada
- [ ] `POST /users/staff/clock-out` - Marcar salida
- [ ] `GET /users/staff/attendance` - Reporte de asistencia

#### Frontend - Módulo de Staff:

**features/staff/pages/StaffListPage.tsx**
- [ ] Tabla de empleados
- [ ] Columnas: Nombre, Rol, Estado, Horario, Acciones
- [ ] Filtros: Rol, Estado (activo/inactivo)
- [ ] Búsqueda por nombre
- [ ] Botón: Agregar empleado

**features/staff/pages/StaffSchedulePage.tsx**
- [ ] Calendario semanal de turnos
- [ ] Vista de horarios por empleado
- [ ] Drag & drop para asignar turnos
- [ ] Validación de conflictos
- [ ] Export de horarios

**features/staff/pages/StaffAttendancePage.tsx**
- [ ] Sistema de check-in/check-out
- [ ] Lista de empleados del día
- [ ] Historial de asistencia
- [ ] Reporte de horas trabajadas

**features/staff/components/**
- [ ] `StaffCard.tsx` - Card de empleado
- [ ] `ShiftCalendar.tsx` - Calendario de turnos
- [ ] `AttendanceTable.tsx` - Tabla de asistencia
- [ ] `StaffForm.tsx` - Formulario de empleado

---

## 🔧 FASE 4: OPTIMIZACIÓN Y CALIDAD

**Duración estimada:** 2 semanas  
**Prioridad:** ⚡ Media

### 4.1 Testing 🧪

#### Backend - Tests unitarios:

**Instalación:**
```bash
npm install --save-dev @nestjs/testing jest ts-jest
```

**Tests a crear:**
- [ ] `auth/auth.service.spec.ts` - Login, register, refresh token
- [ ] `users/users.service.spec.ts` - CRUD operations
- [ ] `orders/orders.service.spec.ts` - Crear orden, actualizar estado
- [ ] `products/products.service.spec.ts` - Validaciones de stock
- [ ] `reservations/reservations.service.spec.ts` - Verificar disponibilidad

**Ejemplo test:**
```typescript
describe('AuthService', () => {
  it('should login user with valid credentials', async () => {
    const result = await authService.login({
      email: 'test@example.com',
      password: 'password123'
    });
    expect(result.user).toBeDefined();
    expect(result.access_token).toBeDefined();
  });
});
```

**Objetivo:** Cobertura mínima del 60%

#### Backend - Tests E2E:

- [ ] `test/auth.e2e-spec.ts` - Flujo completo de autenticación
- [ ] `test/orders.e2e-spec.ts` - Flujo completo de pedido
- [ ] `test/reservations.e2e-spec.ts` - Crear reservación con validaciones

#### Frontend - Tests:

**Instalación:**
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
```

**Tests a crear:**
- [ ] `LoginPage.test.tsx` - Renderizado, validación, submit
- [ ] `OrderCart.test.tsx` - Agregar/remover items, cálculos
- [ ] `ProductForm.test.tsx` - Validación de formulario
- [ ] `TableCard.test.tsx` - Estados visuales
- [ ] `useAuth.test.tsx` - Hook de autenticación

---

### 4.2 Performance ⚡

#### Backend - Optimizaciones:

**Redis Caching:**
```typescript
// Instalar
npm install cache-manager cache-manager-redis-store

// Implementar
@Injectable()
export class ProductsService {
  @Cacheable('products-list', 300) // 5 minutos
  async findAll() {
    return this.productsRepository.find();
  }
}
```

**Tareas:**
- [ ] Cachear lista de productos (5 min)
- [ ] Cachear mesas disponibles (1 min)
- [ ] Cachear estadísticas del dashboard (15 min)
- [ ] Invalidar cache al actualizar datos
- [ ] Indexar campos frecuentes en DB (email, status, restaurant_id)
- [ ] Lazy loading de relaciones TypeORM
- [ ] Pagination en TODOS los endpoints
- [ ] Compression middleware

#### Frontend - Optimizaciones:

- [ ] Code splitting por rutas con `React.lazy()`
- [ ] Lazy loading de componentes pesados (charts, calendar)
- [ ] Memoización con `useMemo` y `useCallback`
- [ ] `React.memo` en componentes de lista
- [ ] Optimizar imágenes: WebP, lazy loading
- [ ] Virtual scrolling para listas grandes (react-window)
- [ ] Debounce en búsquedas
- [ ] Service Worker para PWA (opcional)

---

### 4.3 Seguridad 🔒

#### Backend - Hardening:

**Helmet.js:**
```bash
npm install helmet
```

```typescript
// main.ts
import helmet from 'helmet';
app.use(helmet());
```

**Rate Limiting:**
```bash
npm install @nestjs/throttler
```

```typescript
// app.module.ts
ThrottlerModule.forRoot({
  ttl: 60,
  limit: 10, // 10 requests por minuto
})
```

**Tareas de seguridad:**
- [ ] Instalar y configurar Helmet
- [ ] Rate limiting con @nestjs/throttler
- [ ] Sanitización de inputs con class-validator
- [ ] CSRF tokens (implementar si es necesario)
- [ ] Auditoría de dependencias: `npm audit fix`
- [ ] Variables sensibles SOLO en .env
- [ ] Logs de auditoría (quién modificó qué)
- [ ] Encriptación de datos sensibles en DB
- [ ] Content Security Policy (CSP)
- [ ] SQL injection prevention (TypeORM ya protege)
- [ ] XSS protection adicional

---

### 4.4 Validaciones y UX ✨

#### Mejoras generales:

**Formularios:**
- [ ] Validación exhaustiva con React Hook Form + Zod
- [ ] Mensajes de error claros y en español
- [ ] Indicadores visuales de campos requeridos
- [ ] Autocompletado cuando sea apropiado
- [ ] Confirmación antes de enviar

**Estados de carga:**
- [ ] Loading spinners en todas las acciones async
- [ ] Skeleton loaders en listas
- [ ] Disable de botones durante carga
- [ ] Feedback visual inmediato

**Empty states:**
- [ ] Ilustraciones/iconos descriptivos
- [ ] Mensaje claro de qué hacer
- [ ] Call-to-action para crear primer elemento

**Confirmaciones:**
- [ ] Modal de confirmación en acciones destructivas
- [ ] Explicar consecuencias (ej: "Esto cancelará el pedido")
- [ ] Opción de deshacer cuando sea posible

**Accesibilidad:**
- [ ] ARIA labels en todos los elementos interactivos
- [ ] Navegación por teclado funcional (Tab, Enter, Esc)
- [ ] Contraste adecuado (WCAG AA)
- [ ] Focus visible en elementos
- [ ] Screen reader friendly

**Tooltips y ayuda:**
- [ ] Tooltips explicativos en campos complejos
- [ ] Hints inline en formularios
- [ ] Tour guiado para nuevos usuarios (opcional)

---

## 📦 FASE 5: DEPLOYMENT Y DOCUMENTACIÓN

**Duración estimada:** 2 semanas  
**Prioridad:** 🔥 Alta antes de producción

### 5.1 CI/CD 🔄

#### GitHub Actions - CI:

**Archivo: .github/workflows/ci.yml**
```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies
        working-directory: ./backend
        run: npm ci
      - name: Lint
        run: npm run lint
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci
      - name: Lint
        run: npm run lint
      - name: Build
        run: npm run build
```

#### GitHub Actions - Deploy:

**Archivo: .github/workflows/deploy.yml**
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        run: |
          # Script de deploy según plataforma elegida
```

---

### 5.2 Deployment 🌐

#### Opción A: Vercel + Railway (Recomendado para MVP)

**Frontend en Vercel:**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

**Backend en Railway:**
```bash
# 1. Crear cuenta en Railway.app
# 2. Conectar repositorio de GitHub
# 3. Configurar variables de entorno
# 4. Deploy automático en cada push
```

**Base de datos:**
- PostgreSQL en Railway o Supabase (gratis)
- Redis en Upstash (gratis con límites)

#### Opción B: DigitalOcean App Platform

```bash
# 1. Crear cuenta en DigitalOcean
# 2. App Platform → Create App
# 3. Conectar repo GitHub
# 4. Configurar:
#    - Frontend: Static Site
#    - Backend: Node.js
#    - Database: Managed PostgreSQL
# 5. Deploy automático
```

#### Opción C: AWS (Producción completa)

- Frontend: S3 + CloudFront
- Backend: EC2 / ECS / Elastic Beanstalk
- Database: RDS PostgreSQL
- Cache: ElastiCache Redis
- Load Balancer: ALB
- CDN: CloudFront

---

### 5.3 Monitoreo 📈

#### Error Tracking:

**Sentry:**
```bash
npm install @sentry/node @sentry/react
```

**Backend:**
```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

**Frontend:**
```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

#### Logging:

**Winston Logger:**
```bash
npm install winston
```

```typescript
// backend/src/config/Logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

#### Health Checks:

**Backend endpoints:**
- [ ] `GET /health` - Status general
- [ ] `GET /health/db` - Conexión a BD
- [ ] `GET /health/redis` - Conexión a Redis

```typescript
@Get('health')
async healthCheck() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };
}
```

#### Uptime Monitoring:
- [ ] Configurar Uptime Robot (gratis)
- [ ] Alertas por email si servicio cae
- [ ] Ping cada 5 minutos

---

### 5.4 Documentación 📚

#### README.md completo:

```markdown
# 🍽️ Smart Restaurant Management System

Sistema integral de gestión para restaurantes con pedidos en tiempo real,
reservaciones, gestión de menú, analíticas y panel de cocina.

## 🚀 Stack Tecnológico

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Backend**: NestJS + PostgreSQL + TypeORM
- **Tiempo Real**: Socket.IO
- **Cache**: Redis
- **Colas**: BullMQ

## 📋 Requisitos Previos

- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- npm o yarn

## 🔧 Instalación

### Con Docker (Recomendado)

```bash
# Clonar repositorio
git clone https://github.com/usuario/SmartRestaurantManagementSystem

# Copiar variables de entorno
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Levantar servicios
docker-compose up -d
```

### Manual

**Backend:**
```bash
cd backend
npm install
npm run migration:run
npm run start:dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 🌐 URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/api

## 📁 Estructura del Proyecto

```
SmartRestaurantManagementSystem/
├── backend/
│   ├── src/
│   │   ├── modules/      # Módulos funcionales
│   │   ├── config/       # Configuraciones
│   │   ├── common/       # Utilidades compartidas
│   │   └── main.ts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── features/     # Módulos por funcionalidad
│   │   ├── core/         # Lógica core (router, api, store)
│   │   └── shared/       # Componentes compartidos
│   └── package.json
└── docker-compose.yml
```

## 🔑 Variables de Entorno

Ver `.env.example` en cada carpeta para la lista completa.

## 🧪 Tests

```bash
# Backend
cd backend
npm test                  # Tests unitarios
npm run test:e2e         # Tests E2E
npm run test:cov         # Cobertura

# Frontend
cd frontend
npm test
```

## 📚 Documentación API

La documentación completa de la API está disponible en Swagger:
http://localhost:8000/api

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add: amazing feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

MIT

## 👥 Autores

- **Tu Nombre** - [GitHub](https://github.com/usuario)
```

#### API Documentation (Swagger):

- [ ] Mejorar descripciones de endpoints
- [ ] Agregar ejemplos de request/response
- [ ] Documentar códigos de error
- [ ] Agregar sección de autenticación

#### Postman Collection:

- [ ] Exportar collection de Postman
- [ ] Incluir todos los endpoints
- [ ] Variables de entorno
- [ ] Ejemplos de uso

#### Diagramas:

- [ ] Diagrama Entidad-Relación (ERD) de la base de datos
- [ ] Diagrama de arquitectura del sistema
- [ ] Flujo de autenticación (JWT + Cookies)
- [ ] Flujo de creación de pedido
- [ ] Diagrama de estados de pedido

**Herramientas sugeridas:**
- draw.io para diagramas
- dbdiagram.io para ERD
- Mermaid en Markdown

---

## 🎁 FASE 6: FEATURES ADICIONALES (Opcional)

**Duración estimada:** Variable  
**Prioridad:** 💡 Baja (solo si hay tiempo)

### Bonus Features:

#### 6.1 Multi-restaurante 🏪
- [ ] Admin puede gestionar múltiples restaurantes
- [ ] Selector de restaurante en dashboard
- [ ] Datos aislados por restaurante
- [ ] Estadísticas comparativas entre restaurantes

#### 6.2 Sistema de Pagos 💳
- [ ] Integración con Stripe o PayPal
- [ ] Procesar pagos online
- [ ] Split de cuenta entre comensales
- [ ] Sistema de propinas
- [ ] Historial de transacciones

#### 6.3 Programa de Lealtad 🎁
- [ ] Sistema de puntos por compra
- [ ] Cupones y descuentos
- [ ] Sistema de referidos
- [ ] Niveles de membresía (bronce, plata, oro)

#### 6.4 QR Code para Menú 📱
- [ ] Generar QR por mesa
- [ ] Cliente escanea y ve menú digital
- [ ] Pedir desde el celular sin mesero
- [ ] Notificar cocina automáticamente

#### 6.5 Integración con Delivery 🛵
- [ ] Integración con APIs de Uber Eats / Rappi
- [ ] Tracking de pedidos delivery
- [ ] Gestión de repartidores
- [ ] Optimización de rutas

#### 6.6 App Móvil Nativa 📱
- [ ] Desarrollar con React Native
- [ ] Push notifications nativas
- [ ] Modo offline con sincronización
- [ ] Geolocalización para delivery
- [ ] Cámara para escanear QR

#### 6.7 IA y Machine Learning 🤖
- [ ] Predicción de demanda de productos
- [ ] Recomendaciones personalizadas
- [ ] Chatbot para soporte
- [ ] Detección de fraudes
- [ ] Optimización de precios dinámicos

---

## 📅 CRONOGRAMA RESUMIDO

| Fase | Duración | Tareas Principales | Prioridad |
|------|----------|-------------------|-----------|
| **1. Fundamentos** | 2 semanas | Docker, Migraciones, .env | 🔥 Alta |
| **2. Frontend Core** | 3 semanas | Menu, Orders, Tables, Kitchen, Reservations | 🔥 Alta |
| **3. Avanzadas** | 3 semanas | WebSocket, Notificaciones, Analytics, Staff | ⚡ Media-Alta |
| **4. Calidad** | 2 semanas | Tests, Performance, Seguridad, UX | ⚡ Media |
| **5. Deploy & Docs** | 2 semanas | CI/CD, Deployment, Monitoreo, Documentación | 🔥 Alta |
| **6. Bonus** | Variable | Features opcionales | 💡 Baja |

**TOTAL: 12 semanas (3 meses)** para versión completa y producción

---

## 🎯 PRIORIDADES RECOMENDADAS

### 🔥 ALTA PRIORIDAD (Hacer Primero):

1. **Completar sistema de Orders** (crear, listar, detalles, estados)
2. **Sistema de Menu completo** (CRUD con imágenes)
3. **Panel de cocina funcional** (vista de tickets, cambio de estados)
4. **WebSocket** para actualizaciones en tiempo real
5. **Docker setup** completo (fácil instalación y deploy)

### ⚡ MEDIA PRIORIDAD (Hacer Después):

6. Sistema de reservaciones mejorado (calendario, disponibilidad)
7. Analytics y reportes básicos (ventas, top productos)
8. Tests unitarios principales (auth, orders, products)
9. Sistema de notificaciones (email, push)
10. Gestión de staff (horarios, asistencia)

### 💡 BAJA PRIORIDAD (Hacer al Final):

11. PWA y modo offline
12. Multi-idioma (i18n)
13. Tema oscuro (dark mode)
14. Features bonus (pagos, loyalty, QR)
15. App móvil nativa

---

## ✅ CHECKLIST FINAL ANTES DE PRODUCCIÓN

### Backend:
- [ ] Todos los endpoints tienen manejo de errores
- [ ] DTOs validados con class-validator
- [ ] Tests cubren flujos críticos (>50% coverage)
- [ ] Migraciones de BD documentadas
- [ ] Variables sensibles en .env
- [ ] CORS configurado correctamente
- [ ] Rate limiting activo
- [ ] Logs configurados (Winston)
- [ ] Health checks funcionando

### Frontend:
- [ ] Todas las páginas tienen loading states
- [ ] Empty states en todas las listas
- [ ] Formularios validados completamente
- [ ] Mensajes de error claros
- [ ] Responsive en mobile/tablet
- [ ] Accesibilidad básica (keyboard, ARIA)
- [ ] Imágenes optimizadas

### DevOps:
- [ ] Docker compose funcional
- [ ] CI/CD configurado (GitHub Actions)
- [ ] Backups automáticos de BD
- [ ] Monitoreo activo (Sentry + Uptime Robot)
- [ ] SSL/HTTPS configurado
- [ ] Dominio personalizado
- [ ] Variables de entorno en plataforma

### Documentación:
- [ ] README completo y actualizado
- [ ] .env.example actualizado
- [ ] API documentada en Swagger
- [ ] Diagramas de arquitectura
- [ ] Guía de contribución

### Seguridad:
- [ ] Dependencias auditadas (`npm audit`)
- [ ] Helmet configurado
- [ ] Rate limiting activo
- [ ] Inputs sanitizados
- [ ] Logs de auditoría

---

## 🚀 SIGUIENTES PASOS INMEDIATOS

### Semana 1:

**Día 1-2: Setup de Entorno**
```bash
□ Crear .env.example (backend y frontend)
□ Documentar variables en README
□ Configurar ESLint/Prettier
```

**Día 3-5: Dockerización**
```bash
□ Crear Dockerfiles
□ Crear docker-compose.yml
□ Probar que funciona todo con Docker
□ Documentar setup en README
```

### Semana 2:

**Día 1-3: Sistema de Orders - Backend**
```bash
□ Mejorar endpoints de orders
□ Agregar validaciones
□ Tests unitarios básicos
```

**Día 4-5: Sistema de Orders - Frontend**
```bash
□ Crear OrdersListPage
□ Crear CreateOrderPage
□ Integrar con API
```

---

## 📞 SOPORTE Y RECURSOS

### Documentación Oficial:
- [NestJS Docs](https://docs.nestjs.com/)
- [React Docs](https://react.dev/)
- [TypeORM Docs](https://typeorm.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Socket.IO Docs](https://socket.io/docs/)

### Comunidades:
- [NestJS Discord](https://discord.gg/nestjs)
- [React Discord](https://discord.gg/react)
- Stack Overflow

### Herramientas Útiles:
- [Postman](https://www.postman.com/) - Testing de API
- [DBeaver](https://dbeaver.io/) - Cliente PostgreSQL
- [Redis Commander](http://joeferner.github.io/redis-commander/) - UI para Redis
- [draw.io](https://app.diagrams.net/) - Diagramas

---

## 💪 MOTIVACIÓN

Este proyecto tiene **gran potencial** y una **base sólida**. Con este roadmap:

✅ Tendrás un sistema completo y funcional en 3 meses  
✅ Código de calidad profesional  
✅ Listo para producción  
✅ Portfolio impresionante  

**¡Vamos paso a paso y lo lograrás! 🚀**

---

## 📝 NOTAS FINALES

- Este roadmap es flexible, ajusta según tus necesidades
- Prioriza funcionalidad sobre perfección en las primeras fases
- Haz commits frecuentes y pequeños
- Prueba cada feature antes de continuar
- Documenta mientras desarrollas
- Pide ayuda cuando la necesites

**¡Éxito en tu proyecto! 🎉**

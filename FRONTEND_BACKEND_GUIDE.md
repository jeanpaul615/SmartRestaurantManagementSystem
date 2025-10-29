# 📚 GUÍA COMPLETA: ESTRUCTURA DE NEXT.JS Y CONEXIÓN CON BACKEND

## 🏗️ ESTRUCTURA DE CARPETAS DE NEXT.JS 15 (App Router)

```
frontend/
├── src/
│   ├── app/                          # 📁 RUTAS DE LA APLICACIÓN
│   │   │
│   │   ├── layout.tsx               # 🎨 Layout principal (envuelve todas las páginas)
│   │   ├── page.tsx                 # 🏠 Página principal: http://localhost:3000/
│   │   ├── globals.css              # 🎨 Estilos globales
│   │   │
│   │   ├── api/                     # 🔌 API ROUTES (Backend en Next.js)
│   │   │   └── auth/
│   │   │       └── [...nextauth]/
│   │   │           └── route.ts    # GET/POST /api/auth/*
│   │   │
│   │   ├── login/                   # 🔐 /login
│   │   │   └── page.tsx            # Página de login
│   │   │
│   │   ├── dashboard/               # 📊 /dashboard
│   │   │   └── page.tsx            # Dashboard del usuario
│   │   │
│   │   ├── orders/                  # 📋 /orders
│   │   │   └── page.tsx            # Lista de órdenes
│   │   │
│   │   ├── menu/                    # 🍕 /menu
│   │   │   └── page.tsx            # Menú de productos
│   │   │
│   │   └── reservations/            # 📅 /reservations
│   │       └── page.tsx            # Reservaciones
│   │
│   ├── components/                   # 🧩 COMPONENTES REUTILIZABLES
│   │   ├── AuthProvider.tsx        # Provider de autenticación
│   │   ├── Navbar.tsx              # Barra de navegación
│   │   ├── OrderCard.tsx           # Tarjeta de orden
│   │   └── ProductCard.tsx         # Tarjeta de producto
│   │
│   ├── lib/                         # 📚 LIBRERÍAS Y UTILIDADES
│   │   ├── api.ts                  # ⭐ Cliente API (fetch al backend)
│   │   └── utils.ts                # Funciones utilitarias
│   │
│   ├── hooks/                       # 🪝 CUSTOM HOOKS
│   │   ├── useApi.ts               # ⭐ Hooks para API calls
│   │   └── useAuth.ts              # Hook de autenticación
│   │
│   ├── types/                       # 📝 TIPOS DE TYPESCRIPT
│   │   ├── next-auth.d.ts          # Tipos de NextAuth
│   │   └── models.ts               # Tipos de modelos (Order, Product, etc.)
│   │
│   └── auth.ts                      # ⚙️ Configuración de NextAuth
│
├── public/                          # 📂 ARCHIVOS ESTÁTICOS
│   ├── images/
│   └── icons/
│
├── .env.local                       # 🔐 VARIABLES DE ENTORNO
├── next.config.ts                   # ⚙️ Configuración de Next.js
├── package.json                     # 📦 Dependencias
└── tsconfig.json                    # 📝 Configuración de TypeScript
```

---

## 🔄 CÓMO SE CONECTA FRONTEND CON BACKEND

### **Arquitectura General**

```
┌─────────────────────────────────────┐
│         FRONTEND (Next.js)          │
│         http://localhost:3000       │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │   1. PÁGINAS (UI)           │   │
│  │   /app/orders/page.tsx      │   │
│  └──────────┬──────────────────┘   │
│             │                       │
│             ▼                       │
│  ┌─────────────────────────────┐   │
│  │   2. HOOKS (useOrders)      │   │
│  │   /hooks/useApi.ts          │   │
│  └──────────┬──────────────────┘   │
│             │                       │
│             ▼                       │
│  ┌─────────────────────────────┐   │
│  │   3. API CLIENT (fetch)     │   │
│  │   /lib/api.ts               │   │
│  └──────────┬──────────────────┘   │
│             │                       │
└─────────────┼───────────────────────┘
              │
              │ HTTP REQUEST
              │ (fetch/axios)
              │
              ▼
┌─────────────────────────────────────┐
│         BACKEND (NestJS)            │
│         http://localhost:8000       │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │   1. CONTROLLER             │   │
│  │   @Get('/api/orders')       │   │
│  └──────────┬──────────────────┘   │
│             │                       │
│             ▼                       │
│  ┌─────────────────────────────┐   │
│  │   2. SERVICE                │   │
│  │   findAll()                 │   │
│  └──────────┬──────────────────┘   │
│             │                       │
│             ▼                       │
│  ┌─────────────────────────────┐   │
│  │   3. DATABASE (PostgreSQL)  │   │
│  │   SELECT * FROM orders      │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

---

## 📍 3 FORMAS DE CONECTAR FRONTEND Y BACKEND

### **Opción 1: Usando /lib/api.ts (Recomendado)**

```typescript
// 📁 /lib/api.ts
export const ordersApi = {
  async getAll(token: string) {
    const response = await fetch('http://localhost:8000/api/orders', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  }
};

// 📁 /app/orders/page.tsx
import { ordersApi } from '@/lib/api';
import { useSession } from 'next-auth/react';

export default function OrdersPage() {
  const { data: session } = useSession();
  
  const handleGetOrders = async () => {
    const orders = await ordersApi.getAll(session.user.accessToken);
    console.log(orders);
  };
}
```

### **Opción 2: Usando Custom Hooks (Más fácil)**

```typescript
// 📁 /hooks/useApi.ts
export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Lógica de fetch encapsulada
  
  return { orders, loading, createOrder, deleteOrder };
}

// 📁 /app/orders/page.tsx
import { useOrders } from '@/hooks/useApi';

export default function OrdersPage() {
  const { orders, loading, createOrder } = useOrders();
  
  // Ya tienes todo listo para usar!
  return <div>{orders.map(...)}</div>;
}
```

### **Opción 3: Fetch directo (No recomendado)**

```typescript
// 📁 /app/orders/page.tsx
export default function OrdersPage() {
  const handleGetOrders = async () => {
    const response = await fetch('http://localhost:8000/api/orders', {
      headers: {
        'Authorization': 'Bearer token_aqui'
      }
    });
    const orders = await response.json();
  };
}
```

---

## 🎯 FLUJO COMPLETO DE UNA PETICIÓN

### **Ejemplo: Obtener órdenes**

```
1. USUARIO ABRE LA PÁGINA
   └─> http://localhost:3000/orders

2. COMPONENTE SE MONTA
   └─> /app/orders/page.tsx

3. HOOK SE EJECUTA
   └─> useOrders()
       │
       ├─> useState() para estados
       ├─> useSession() para obtener token
       └─> useEffect() para fetch automático

4. FETCH AL BACKEND
   └─> fetch('http://localhost:8000/api/orders', {
         headers: { 'Authorization': 'Bearer abc123...' }
       })

5. BACKEND PROCESA
   └─> NestJS Controller recibe petición
       │
       ├─> Valida JWT token
       ├─> Extrae user_id del token
       └─> Llama al Service
           │
           └─> Service consulta BD
               │
               └─> PostgreSQL retorna datos

6. RESPUESTA AL FRONTEND
   └─> Backend retorna JSON:
       {
         orders: [
           { id: 1, status: 'pending', ... },
           { id: 2, status: 'completed', ... }
         ]
       }

7. ACTUALIZAR UI
   └─> setOrders(data)
       │
       └─> React re-renderiza componente
           │
           └─> Usuario ve las órdenes en pantalla ✅
```

---

## 🔑 AUTENTICACIÓN EN LAS PETICIONES

### **¿Cómo se envía el token?**

```typescript
// 1. Obtener el token de NextAuth
const { data: session } = useSession();
const token = session?.user?.accessToken;

// 2. Incluirlo en el header Authorization
const response = await fetch('http://localhost:8000/api/orders', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

// 3. El backend valida el token con JwtAuthGuard
// 4. Si es válido, procesa la petición
// 5. Si no, retorna 401 Unauthorized
```

---

## 📊 TIPOS DE PETICIONES HTTP

| Método | Propósito | Ejemplo |
|--------|-----------|---------|
| **GET** | Obtener datos | `fetch('/api/orders')` |
| **POST** | Crear nuevo | `fetch('/api/orders', { method: 'POST', body: ... })` |
| **PATCH** | Actualizar parcial | `fetch('/api/orders/1', { method: 'PATCH', body: ... })` |
| **PUT** | Actualizar completo | `fetch('/api/orders/1', { method: 'PUT', body: ... })` |
| **DELETE** | Eliminar | `fetch('/api/orders/1', { method: 'DELETE' })` |

---

## 🌐 VARIABLES DE ENTORNO

```bash
# frontend/.env.local
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXTAUTH_SECRET=tu_secreto
NEXTAUTH_URL=http://localhost:3000
```

```typescript
// Usar en el código
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
// IMPORTANTE: Solo las variables con NEXT_PUBLIC_ son accesibles en el cliente
```

---

## 📝 RESUMEN DE ARCHIVOS CLAVE

| Archivo | Propósito | Cuándo usar |
|---------|-----------|-------------|
| **/lib/api.ts** | Cliente API centralizado | Para todas las llamadas al backend |
| **/hooks/useApi.ts** | Hooks personalizados | Para simplificar componentes |
| **/app/*/page.tsx** | Páginas/Rutas | Para crear nuevas pantallas |
| **/components/*.tsx** | Componentes reutilizables | Para UI que se repite |
| **/auth.ts** | Config de NextAuth | Para autenticación |
| **/.env.local** | Variables de entorno | Para configuración sensible |

---

## 🚀 PRÓXIMOS PASOS

1. ✅ Usar `/lib/api.ts` para todas las llamadas
2. ✅ Crear hooks personalizados en `/hooks/useApi.ts`
3. ✅ Usar hooks en tus páginas para simplificar código
4. ✅ Agregar manejo de errores
5. ✅ Implementar loading states
6. ✅ Agregar validación de formularios

---

## 🎓 CONCEPTOS CLAVE

- **App Router**: Sistema de rutas basado en carpetas
- **Server Components**: Componentes que se renderizan en el servidor (por defecto)
- **Client Components**: Componentes con interactividad (`"use client"`)
- **API Routes**: Endpoints de backend dentro de Next.js
- **Custom Hooks**: Lógica reutilizable de React
- **NextAuth**: Librería para autenticación
- **JWT**: Tokens para validar identidad

---

¿Quieres que profundice en alguna parte específica? 🎯

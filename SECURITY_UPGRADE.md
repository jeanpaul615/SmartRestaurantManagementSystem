# 🔒 Actualización de Seguridad: Memory + HttpOnly Cookies

## 📋 Resumen

Se ha migrado el sistema de autenticación de **localStorage** (inseguro) a **Memory + HttpOnly Cookies** (patrón usado por Auth0, Okta, Google, etc.).

---

## ✅ Cambios Implementados

### 🔧 Backend

#### 1. **AuthController** (`backend/src/modules/auth/auth.controller.ts`)
- ✅ Los endpoints `login`, `register` y `refresh` ahora envían tokens en cookies HttpOnly
- ✅ Los endpoints retornan solo información del usuario (no tokens en JSON)
- ✅ El endpoint `logout` limpia las cookies automáticamente
- ✅ Agregados métodos helper: `setAuthCookies()` y `clearAuthCookies()`

```typescript
// Configuración de cookies
res.cookie('access_token', token, {
  httpOnly: true,      // No accesible desde JavaScript
  secure: true,        // Solo HTTPS en producción
  sameSite: 'strict',  // Protección CSRF
  maxAge: 15 * 60 * 1000  // 15 minutos
});
```

#### 2. **main.ts** (`backend/src/main.ts`)
- ✅ Instalado y configurado `cookie-parser`
- ✅ CORS ya estaba configurado con `credentials: true`

#### 3. **JwtStrategy** (`backend/src/modules/auth/strategies/jwt.strategy.ts`)
- ✅ Modificado para extraer el token desde cookies en lugar del header Authorization
- ✅ Mantiene compatibilidad con headers (backwards compatibility)

#### 4. **UsersService** (`backend/src/modules/users/users.service.ts`)
- ✅ Corregido bug: Se eliminó el hash duplicado de contraseñas

---

### 🎨 Frontend

#### 1. **authService.ts** (`frontend/src/features/auth/services/authService.ts`)
- ✅ Los tokens ya NO se guardan en localStorage
- ✅ El usuario se guarda en memoria + sessionStorage
- ✅ Métodos actualizados para trabajar con cookies
- ✅ `getAccessToken()` marcado como deprecated

#### 2. **axiosInstance.ts** (`frontend/src/core/api/axiosInstance.ts`)
- ✅ Agregado `withCredentials: true` para enviar cookies
- ✅ Request interceptor eliminado (no se necesita agregar token manualmente)
- ✅ Response interceptor actualizado para refresh automático con cookies

---

## 🔒 Mejoras de Seguridad

| Aspecto | Antes (localStorage) | Ahora (Cookies) |
|---------|---------------------|-----------------|
| **Acceso desde JS** | ✅ Accesible | ❌ No accesible (httpOnly) |
| **Vulnerabilidad XSS** | 🔴 Alta | 🟢 Protegido |
| **Vulnerabilidad CSRF** | 🟢 N/A | 🟢 Protegido (sameSite) |
| **Persistencia** | Permanente | Temporal (sesión) |
| **Transmisión** | Manual | Automática |

---

## 🚀 Cómo Funciona

### 1. **Login/Register**
```
Frontend → POST /auth/login
          ← Set-Cookie: access_token (HttpOnly)
          ← Set-Cookie: refresh_token (HttpOnly)
          ← { user: {...}, message: "..." }
```

### 2. **Requests Autenticados**
```
Frontend → GET /api/some-endpoint
          → Cookie: access_token=...
Backend  → Lee token desde cookies
          → Valida con JwtStrategy
          ← Response
```

### 3. **Token Expirado (Auto-refresh)**
```
Frontend → GET /api/some-endpoint
Backend  ← 401 Unauthorized
Frontend → POST /auth/refresh (con refresh_token en cookie)
Backend  ← Set-Cookie: access_token (nuevo)
          ← Set-Cookie: refresh_token (nuevo)
Frontend → Reintenta request original (automático)
```

### 4. **Logout**
```
Frontend → POST /auth/logout
Backend  → Revoca refresh token en BD
          → Limpia cookies
          ← { message: "..." }
```

---

## 📝 Notas Importantes

### ⚠️ Usuario ya registrado con contraseña incorrecta
El usuario con ID 2 (`paul123@example.com`) tiene la contraseña hasheada dos veces debido al bug anterior.

**Solución:**
1. Eliminar el usuario desde la BD
2. Registrarlo nuevamente

### ⚠️ Validación de admin temporalmente deshabilitada
En `auth.controller.ts`, la validación para crear admins está comentada para permitir el registro del primer admin.

**IMPORTANTE:** Una vez que registres el primer admin, descomentar estas líneas:
```typescript
if (dto.role === 'admin') {
  if (!currentUser || currentUser.role !== 'admin') {
    throw new ForbiddenException('Solo los administradores pueden crear usuarios admin');
  }
}
```

---

## 🧪 Testing

### Probar Login:
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@restaurant.com","password":"admin123"}' \
  -c cookies.txt
```

### Probar Request Autenticado:
```bash
curl http://localhost:8000/api/some-endpoint \
  -b cookies.txt
```

### Probar Logout:
```bash
curl -X POST http://localhost:8000/auth/logout \
  -b cookies.txt
```

---

## 🔄 Rollback (si es necesario)

Si necesitas volver al sistema anterior:
1. Restaurar `authService.ts` original (con localStorage)
2. Restaurar `axiosInstance.ts` original (sin withCredentials)
3. Restaurar `auth.controller.ts` original (retornar tokens en JSON)
4. Restaurar `jwt.strategy.ts` original (solo Authorization header)

---

## 📚 Referencias

- [OWASP: Token Storage](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
- [Auth0: Token Storage](https://auth0.com/docs/secure/security-guidance/data-security/token-storage)
- [HttpOnly Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies)

---

## 👥 Autor

Jean Paul - Smart Restaurant Management System
Fecha: November 2, 2025

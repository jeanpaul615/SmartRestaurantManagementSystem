1. Backend - Configuración Base JWT (6 pasos)

Instalar dependencias
Crear JWT Strategy ----- LISTO
Configurar JwtModule ----- LISTO

2. Backend - Guards y Decoradores (7 pasos)

JwtAuthGuard, RolesGuard ----- LISTO
@Public(), @Roles(), @CurrentUser()  
Aplicar guards globalmente

3. Backend - Refresh Tokens (6 pasos)

Entidad RefreshToken
Endpoints /refresh y /logout
Revocación de tokens

4. Backend - Proteger Rutas (6 pasos)

Definir roles (admin, waiter, chef, customer)
Proteger controllers: orders, tables, reservations, products, users

5. Frontend - Auth Service & Context (5 pasos)

Crear AuthService
AuthContext y useAuth hook
Integrar en layout

6. Frontend - Interceptor HTTP (2 pasos)

API client con auto-refresh
Manejo de tokens expirados

7. Frontend - Páginas de Auth (3 pasos)

Login page
Middleware de protección
Dashboard básico

8. Testing y Seguridad (3 pasos)

CORS
Variables de entorno
Pruebas completas
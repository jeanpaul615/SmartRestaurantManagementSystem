# 🔐 Configuración de Google OAuth para Smart Restaurant

## 📋 Requisitos previos
- Cuenta de Google (Gmail)
- Proyecto configurado en Google Cloud Console

---

## 🚀 Paso 1: Crear un proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Haz clic en el menú desplegable del proyecto (arriba a la izquierda)
3. Clic en **"Nuevo proyecto"**
4. Ingresa:
   - **Nombre del proyecto**: `SmartRestaurant` (o el que prefieras)
   - **Organización**: Déjalo por defecto
5. Haz clic en **"Crear"**

---

## 🔑 Paso 2: Habilitar la API de Google+

1. En el menú lateral, ve a **"API y servicios"** → **"Biblioteca"**
2. Busca **"Google+ API"** o **"Google Identity"**
3. Haz clic en **"Habilitar"**

---

## 🎫 Paso 3: Crear credenciales OAuth 2.0

1. Ve a **"API y servicios"** → **"Credenciales"**
2. Haz clic en **"+ CREAR CREDENCIALES"** → **"ID de cliente de OAuth"**
3. Si es la primera vez, deberás configurar la **"Pantalla de consentimiento de OAuth"**:
   
   ### Configurar pantalla de consentimiento:
   - **Tipo de usuario**: Selecciona **"Externo"** → Clic en **"Crear"**
   - **Información de la aplicación**:
     - Nombre de la aplicación: `Smart Restaurant Management System`
     - Correo electrónico de asistencia: Tu email de Google
     - Logo de la aplicación: (Opcional)
   - **Dominios autorizados**: Déjalo vacío por ahora
   - **Información de contacto del desarrollador**: Tu email
   - Haz clic en **"Guardar y continuar"**
   
   - **Ámbitos (Scopes)**: 
     - Clic en **"Agregar o quitar ámbitos"**
     - Selecciona:
       - `userinfo.email`
       - `userinfo.profile`
     - Clic en **"Actualizar"** → **"Guardar y continuar"**
   
   - **Usuarios de prueba**: 
     - Agrega tu email de Google para poder probar
     - Clic en **"Guardar y continuar"**

4. Ahora vuelve a **"Credenciales"** → **"+ CREAR CREDENCIALES"** → **"ID de cliente de OAuth"**
5. Selecciona **"Aplicación web"**
6. Configura:
   - **Nombre**: `Smart Restaurant Web Client`
   - **Orígenes de JavaScript autorizados**:
     ```
     http://localhost:3000
     http://localhost:8000
     ```
   - **URIs de redirección autorizadas**:
     ```
     http://localhost:8000/api/auth/google/callback
     http://localhost:3000/api/auth/callback/google
     ```
7. Haz clic en **"Crear"**

---

## 📝 Paso 4: Copiar las credenciales

Después de crear las credenciales, verás un popup con:
- **ID de cliente**: `123456789-abcdefg.apps.googleusercontent.com`
- **Secreto del cliente**: `GOCSPX-abcdefghijklmnop`

**¡Guárdalos!** Los necesitarás en el siguiente paso.

---

## ⚙️ Paso 5: Configurar variables de entorno

### Backend (NestJS)

Crea o edita el archivo `.env` en la carpeta `backend/`:

```env
# Google OAuth
GOOGLE_CLIENT_ID=TU_CLIENT_ID_AQUI
GOOGLE_CLIENT_SECRET=TU_CLIENT_SECRET_AQUI
GOOGLE_CALLBACK_URL=http://localhost:8000/api/auth/google/callback

# Frontend URL (para redirección después de login)
FRONTEND_URL=http://localhost:3000
```

### Frontend (Next.js)

Crea o edita el archivo `.env.local` en la carpeta `frontend/`:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu_secreto_aleatorio_muy_seguro_aqui_min_32_caracteres

# Google OAuth
GOOGLE_CLIENT_ID=1056109900770-pmvobr7jrl38sgsn3hc2cdc07a1d20fr.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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

# Backend API
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

**Generar NEXTAUTH_SECRET:**
```bash
# En tu terminal (Git Bash, PowerShell, etc.)
openssl rand -base64 32
```

---

## 🧪 Paso 6: Probar la integración

1. **Inicia el backend**:
   ```bash
   cd backend
   npm run start:dev
   ```

2. **Inicia el frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Prueba el login**:
   - Ve a: http://localhost:3000/login
   - Haz clic en **"Continuar con Google"**
   - Inicia sesión con tu cuenta de Google
   - Deberías ser redirigido al dashboard

---

## 🔒 Paso 7: Para producción

Cuando vayas a producción, deberás:

1. **Agregar los dominios de producción** en Google Cloud Console:
   - Orígenes autorizados: `https://tudominio.com`
   - URIs de redirección: 
     - `https://tudominio.com/api/auth/google/callback` (Backend)
     - `https://tudominio.com/api/auth/callback/google` (Frontend)

2. **Actualizar variables de entorno** con las URLs de producción

3. **Publicar la aplicación** en Google Cloud Console:
   - Ve a la **"Pantalla de consentimiento de OAuth"**
   - Clic en **"Publicar aplicación"**

---

## 🐛 Solución de problemas

### Error: "redirect_uri_mismatch"
- Verifica que las URIs de redirección en Google Cloud Console coincidan exactamente con las de tu aplicación
- No olvides el protocolo (`http://` o `https://`)

### Error: "Access blocked: This app's request is invalid"
- Verifica que hayas habilitado la API de Google+ o Google Identity
- Asegúrate de que tu email esté agregado como usuario de prueba

### El usuario no se crea en la base de datos
- Verifica que el backend esté corriendo en el puerto 8000
- Revisa los logs del backend para ver errores
- Verifica que la tabla `users` exista en la base de datos

### Error: "NEXTAUTH_SECRET missing"
- Genera un secreto con `openssl rand -base64 32`
- Agrégalo al archivo `.env.local` del frontend

---

## 📚 Recursos adicionales

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [NestJS Passport Documentation](https://docs.nestjs.com/security/authentication)

---

## ✅ Checklist final

- [ ] Proyecto creado en Google Cloud Console
- [ ] API de Google+ habilitada
- [ ] Credenciales OAuth creadas
- [ ] Variables de entorno configuradas (backend y frontend)
- [ ] Backend corriendo en puerto 8000
- [ ] Frontend corriendo en puerto 3000
- [ ] Login con Google funcionando
- [ ] Usuario creado en la base de datos después del primer login

---

**¡Listo! 🎉 Ahora tus usuarios pueden iniciar sesión con Google.**

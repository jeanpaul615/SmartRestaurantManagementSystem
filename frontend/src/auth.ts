import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // 🔐 Proveedor de Google
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    
    // 📧 Proveedor de credenciales (email + password)
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "tu@email.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Llamar al backend NestJS para validar credenciales
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
          const response = await fetch(`${backendUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            return null;
          }

          const data = await response.json();
          
          // Retornar usuario con tokens
          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.username,
            role: data.user.role,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
          };
        } catch (error) {
          console.error('Error en authorize:', error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    // Callback cuando se inicia sesión con Google
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Llamar al backend para crear/obtener usuario de Google
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
          const response = await fetch(`${backendUrl}/api/auth/google/callback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: profile?.email,
              name: profile?.name,
              picture: profile?.picture,
              googleId: account.providerAccountId,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            // Guardar tokens en el objeto user
            user.accessToken = data.access_token;
            user.refreshToken = data.refresh_token;
            user.role = data.user.role;
          }
        } catch (error) {
          console.error('Error al sincronizar con backend:', error);
          return false;
        }
      }
      return true;
    },

    // Agregar tokens al JWT
    async jwt({ token, user, account }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },

    // Agregar tokens a la sesión
    async session({ session, token }) {
      session.user.accessToken = token.accessToken as string;
      session.user.refreshToken = token.refreshToken as string;
      session.user.role = token.role as string;
      session.user.id = token.id as string;
      return session;
    },
  },

  pages: {
    signIn: '/login', // Página personalizada de login
    error: '/auth/error',
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },

  secret: process.env.NEXTAUTH_SECRET,
});

"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Smart Restaurant Dashboard
          </h1>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            ¡Bienvenido, {session.user.name || session.user.email}! 👋
          </h2>
          <p className="text-gray-600">
            Has iniciado sesión exitosamente en el sistema de gestión de
            restaurantes.
          </p>
        </div>

        {/* User info */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Información de la sesión
          </h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="font-medium text-gray-700 w-32">Email:</span>
              <span className="text-gray-600">{session.user.email}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-700 w-32">Usuario:</span>
              <span className="text-gray-600">{session.user.name}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-700 w-32">Rol:</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {session.user.role}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-700 w-32">ID:</span>
              <span className="text-gray-600 font-mono text-sm">
                {session.user.id}
              </span>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-200">
            <div className="text-blue-600 text-3xl mb-3">🍽️</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Gestionar Órdenes
            </h3>
            <p className="text-gray-600 text-sm">
              Administra las órdenes activas del restaurante
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-200">
            <div className="text-green-600 text-3xl mb-3">📋</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Gestionar Menú
            </h3>
            <p className="text-gray-600 text-sm">
              Edita los productos y precios del menú
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition duration-200">
            <div className="text-purple-600 text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Ver Reportes
            </h3>
            <p className="text-gray-600 text-sm">
              Consulta estadísticas y reportes de ventas
            </p>
          </div>
        </div>

        {/* Debug info (solo en desarrollo) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 bg-gray-100 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Debug - Tokens (Solo desarrollo)
            </h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium text-gray-700">Access Token:</span>
                <pre className="mt-1 p-2 bg-white rounded text-xs overflow-x-auto">
                  {session.user.accessToken?.substring(0, 50)}...
                </pre>
              </div>
              <div>
                <span className="font-medium text-gray-700">
                  Refresh Token:
                </span>
                <pre className="mt-1 p-2 bg-white rounded text-xs overflow-x-auto">
                  {session.user.refreshToken?.substring(0, 50)}...
                </pre>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

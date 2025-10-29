"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">SR</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Smart Restaurant</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium">Inicio</a>
              <a href="#features" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium">Características</a>
              <a href="#contact" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium">Contacto</a>
            </nav>
            <Link 
              href="/login"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extrabold text-slate-900 mb-4">
            Sistema de Gestión
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Inteligente para Restaurantes
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Administra reservas, pedidos, mesas y notificaciones de forma eficiente y moderna
          </p>
        </div>

        {/* Features Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Feature 1 */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border border-slate-100">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Reservas</h3>
            <p className="text-slate-600">
              Gestiona las reservas de tus clientes de manera eficiente con confirmaciones automáticas
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border border-slate-100">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Pedidos</h3>
            <p className="text-slate-600">
              Administra los pedidos en tiempo real con seguimiento desde la cocina hasta la mesa
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border border-slate-100">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Mesas</h3>
            <p className="text-slate-600">
              Control completo del estado y disponibilidad de todas las mesas del restaurante
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border border-slate-100">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Menú Digital</h3>
            <p className="text-slate-600">
              Actualiza tu menú en tiempo real con precios, descripciones y disponibilidad
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border border-slate-100">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Notificaciones</h3>
            <p className="text-slate-600">
              Sistema de alertas en tiempo real para el personal y los clientes
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border border-slate-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Usuarios</h3>
            <p className="text-slate-600">
              Gestión de roles y permisos para todo el personal del restaurante
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-12 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            ¿Listo para optimizar tu restaurante?
          </h3>
          <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
            Comienza a usar nuestro sistema de gestión y mejora la experiencia de tus clientes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/login"
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors shadow-lg"
            >
              Empezar Ahora
            </Link>
            <Link 
              href="/login"
              className="bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-800 transition-colors border-2 border-white/20"
            >
              Ver Demo
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-white border-t border-slate-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-600 text-sm">
              © 2025 Smart Restaurant Management System. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-500 hover:text-indigo-600 transition-colors text-sm">Privacidad</a>
              <a href="#" className="text-slate-500 hover:text-indigo-600 transition-colors text-sm">Términos</a>
              <a href="#" className="text-slate-500 hover:text-indigo-600 transition-colors text-sm">Soporte</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

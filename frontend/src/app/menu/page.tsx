"use client";

import { useEffect, useState } from "react";
import { productsApi, Product } from "@/lib/api";

/**
 * 🍕 EJEMPLO: Página de menú (productos)
 * 
 * Este componente muestra cómo:
 * 1. Hacer peticiones sin autenticación (público)
 * 2. Mostrar datos del backend
 * 3. Filtrar y buscar
 */
export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // 🔄 Obtener productos al montar el componente
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        
        // ✅ Petición pública (sin token)
        const data = await productsApi.getAll();
        
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error("Error al cargar productos:", err);
        alert("Error al cargar el menú");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // 🔍 Filtrar productos
  useEffect(() => {
    let filtered = products;

    // Filtrar por categoría
    if (selectedCategory !== "all") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  // Obtener categorías únicas
  const categories = Array.from(new Set(products.map(p => p.category)));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando menú...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-gray-900">🍽️ Nuestro Menú</h1>
          <p className="text-gray-600 mt-2">Explora nuestros deliciosos platillos</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Búsqueda */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar platillos..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Categorías */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="all">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lista de productos */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">
              No se encontraron productos
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-200"
              >
                {/* Imagen placeholder */}
                <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <span className="text-6xl">🍽️</span>
                </div>

                {/* Contenido */}
                <div className="p-6">
                  {/* Categoría */}
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full mb-2">
                    {product.category}
                  </span>

                  {/* Nombre */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h3>

                  {/* Descripción */}
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Precio y Stock */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">
                        ${product.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Stock: {product.stock}
                      </p>
                    </div>

                    <button
                      disabled={product.stock === 0}
                      className={`px-6 py-2 rounded-lg font-semibold transition duration-200 ${
                        product.stock > 0
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {product.stock > 0 ? "Ordenar" : "Agotado"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

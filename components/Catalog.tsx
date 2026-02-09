import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from './ProductCard';
import { Product, Category } from '../types';
import { useApp } from '../App';

interface CatalogProps {
  category: Category | 'Catalog' | 'Favorites';
}

const Catalog: React.FC<CatalogProps> = ({ category }) => {
  const { favorites, supabase } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const titles: Record<string, string> = {
    Catalog: 'Todo Nuestro Mundo ✨',
    Escolar: 'Útiles Escolares ✏️',
    Regalaría: 'Para Regalar 🎁',
    Oficina: 'Tu Oficina Matita 💼',
    Tecnología: 'Tecnología & Más 🎧',
    Novedades: '¡Recién Llegado! 🆕',
    Ofertas: 'Precios Increíbles 🏷️',
    Favorites: 'Mis Tesoros ❤️'
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) {
        setProducts(data.map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: Number(p.price) || 0,
          oldPrice: p.old_price ? Number(p.old_price) : undefined,
          points: Math.floor(Number(p.points)) || 0,
          category: p.category,
          images: p.images || [],
          colors: p.colors || []
        })));
      }
      setLoading(false);
    };

    fetchProducts();
  }, [supabase]);

  // 1. Filtrado base por búsqueda y favoritos
  const filteredBase = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      if (category === 'Favorites') return matchesSearch && favorites.includes(p.id);
      if (category === 'Ofertas') {
        const hasDiscount = p.oldPrice && p.oldPrice > p.price;
        return matchesSearch && (hasDiscount || p.category === 'Ofertas');
      }
      if (category !== 'Catalog') return matchesSearch && p.category === category;
      return matchesSearch;
    });
  }, [category, searchTerm, favorites, products]);

  // 2. Agrupación por categorías para la vista "Catalog"
  const groupedProducts = useMemo(() => {
    if (category !== 'Catalog') return null;
    
    const groups: Record<string, Product[]> = {};
    filteredBase.forEach(p => {
      if (!groups[p.category]) groups[p.category] = [];
      groups[p.category].push(p);
    });
    return groups;
  }, [category, filteredBase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="w-16 h-16 border-4 border-[#fadb31] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-20 animate-fadeIn">
      {/* Header y Buscador */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10">
        <div>
          <h2 className="text-6xl font-matita font-bold text-[#f6a118] drop-shadow-sm">
            {titles[category]}
          </h2>
          <p className="text-2xl font-matita text-gray-400 mt-2 italic">Descubre la magia de la papelería.</p>
        </div>
        
        <div className="relative max-w-xl w-full group">
          <input
            type="text"
            placeholder="Buscar en esta sección..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-10 py-5 rounded-[2.5rem] border-4 border-[#fadb31] focus:outline-none focus:ring-8 focus:ring-[#fadb31]/10 text-2xl font-matita shadow-xl transition-all"
          />
          <div className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#f6a118]">
             <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
             </svg>
          </div>
        </div>
      </div>

      {/* Renderizado de Productos */}
      {category === 'Catalog' && groupedProducts ? (
        // VISTA POR SECCIONES (Catalog)
        <div className="space-y-32">
          {Object.entries(groupedProducts).map(([catName, catProducts]) => (
            <div key={catName} className="space-y-10">
              <div className="flex items-center gap-6">
                <div className="h-1 flex-grow bg-gradient-to-r from-[#fadb31]/40 to-transparent rounded-full"></div>
                <h3 className="text-4xl font-matita font-bold text-[#f6a118] bg-[#fef9eb] px-8 py-2 rounded-full border-2 border-[#fadb31]/20">
                  {titles[catName] || catName}
                </h3>
                <div className="h-1 flex-grow bg-gradient-to-l from-[#fadb31]/40 to-transparent rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-20">
                {catProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // VISTA SIMPLE (Categoría específica o Favoritos)
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-20">
          {filteredBase.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredBase.length === 0 && (
        <div className="text-center py-40 space-y-8">
          <div className="text-8xl opacity-40">🌸</div>
          <p className="text-4xl font-matita text-gray-300 italic">
            {category === 'Favorites' 
              ? 'Aún no guardaste nada especial...' 
              : 'Parece que no hay tesoros con ese nombre...'}
          </p>
          <button 
            onClick={() => setSearchTerm('')} 
            className="text-[#f6a118] font-matita text-2xl underline hover:text-[#fadb31] transition-colors"
          >
            Ver todo el catálogo
          </button>
        </div>
      )}
    </div>
  );
};

export default Catalog;

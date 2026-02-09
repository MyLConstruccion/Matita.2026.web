
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import { Product, Category } from '../types';
import { useApp } from '../App';

interface CatalogProps {
  category: Category | 'Catalog' | 'Favorites';
}

const Catalog: React.FC<CatalogProps> = ({ category }) => {
  const { favorites, supabase } = useApp();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) {
        setProducts(data.map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          oldPrice: p.old_price,
          points: p.points,
          category: p.category,
          images: p.images || [],
          colors: p.colors || []
        })));
      }
      setLoading(false);
    };

    fetchProducts();
  }, [supabase, category]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (category === 'Favorites') {
        return matchesSearch && favorites.includes(p.id);
      }
      if (category === 'Catalog') {
        return matchesSearch;
      }
      if (category === 'Ofertas') {
        return matchesSearch && (p.oldPrice !== null || p.category === 'Ofertas');
      }
      
      return matchesSearch && p.category === category;
    });
  }, [category, searchTerm, favorites, products]);

  const categoryList: {label: string, cat: Category, icon: string}[] = [
    { label: 'Escolar', cat: 'Escolar', icon: '✏️' },
    { label: 'Regalaría', cat: 'Regalaría', icon: '🎁' },
    { label: 'Oficina', cat: 'Oficina', icon: '💼' },
    { label: 'Tecnología', cat: 'Tecnología', icon: '🎧' },
    { label: 'Novedades', cat: 'Novedades', icon: '✨' },
    { label: 'Ofertas', cat: 'Ofertas', icon: '🏷️' }
  ];

  const titles = {
    Catalog: 'Mundo Matita ✨',
    Escolar: 'Útiles Escolares ✏️',
    Regalaría: 'Para Regalar 🎁',
    Oficina: 'Tu Oficina 💼',
    Tecnología: 'Tecnología 🎧',
    Novedades: '¡Recién Llegado! 🆕',
    Ofertas: '¡Imperdibles! 🏷️',
    Favorites: 'Mis Favoritos ❤️'
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="w-20 h-20 border-8 border-[#fadb31] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#f6a118] font-bold animate-pulse text-3xl">Buscando tesoros...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fadeIn pb-24 px-2 md:px-6">
      {/* Header y Buscador */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10">
        <div>
           <h2 className="text-5xl md:text-7xl font-matita font-bold text-[#f6a118] drop-shadow-sm">
            {titles[category as keyof typeof titles]}
          </h2>
          <p className="text-2xl md:text-3xl font-matita text-gray-400 mt-3 italic">Descubre la magia en cada detalle.</p>
        </div>
        <div className="relative max-w-2xl w-full">
          <input
            type="text"
            placeholder="¿Qué buscas hoy?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-10 py-5 rounded-[2.5rem] border-4 border-[#fadb31] text-2xl font-matita shadow-xl focus:ring-[12px] focus:ring-[#fadb31]/10 outline-none transition-all"
          />
          <span className="absolute right-8 top-1/2 -translate-y-1/2 text-4xl">🔍</span>
        </div>
      </div>

      {/* Barra de Categorías */}
      <div className="bg-white/60 p-5 rounded-[3.5rem] border-4 border-white shadow-sm overflow-hidden backdrop-blur-sm">
        <div className="flex overflow-x-auto gap-5 py-3 scrollbar-hide px-3 items-center">
           <button 
             onClick={() => navigate('/catalog')}
             className={`px-10 py-4 rounded-[2rem] text-2xl font-bold transition-all whitespace-nowrap border-4 ${category === 'Catalog' ? 'matita-gradient-orange text-white border-white shadow-xl scale-110' : 'bg-white text-gray-400 border-transparent hover:text-[#f6a118] hover:border-[#fadb31]'}`}
           >
             🌈 Todo
           </button>
           {categoryList.map(item => (
             <button 
               key={item.cat}
               onClick={() => navigate(`/${item.cat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`)}
               className={`px-10 py-4 rounded-[2rem] text-2xl font-bold transition-all whitespace-nowrap border-4 ${category === item.cat ? 'matita-gradient-orange text-white border-white shadow-xl scale-110' : 'bg-white text-gray-400 border-transparent hover:text-[#f6a118] hover:border-[#fadb31]'}`}
             >
               {item.icon} {item.label}
             </button>
           ))}
        </div>
      </div>

      {/* Grilla de Productos - AJUSTADA PARA EVITAR CARDS GIGANTES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-40 space-y-8 bg-white/40 rounded-[5rem] border-8 border-dashed border-white">
          <div className="text-[12rem] opacity-20 grayscale">🌸</div>
          <p className="text-4xl font-matita text-gray-400 italic">"Aún no hay tesoros aquí..."</p>
          <button onClick={() => navigate('/catalog')} className="px-14 py-6 matita-gradient-orange text-white rounded-full font-bold text-3xl shadow-2xl hover:scale-110 transition-all">Ver catálogo completo</button>
        </div>
      )}
    </div>
  );
};

export default Catalog;

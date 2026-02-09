
import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { useApp } from '../App';

const getImgUrl = (id: string, w = 600) => {
  if (!id) return "https://via.placeholder.com/600x600?text=Matita";
  if (id.startsWith('data:') || id.startsWith('http')) return id;
  return `https://res.cloudinary.com/dllm8ggob/image/upload/q_auto,f_auto,w_${w}/${id}`;
};

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, favorites, toggleFavorite } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.color || '');
  const [activeImage, setActiveImage] = useState(0);

  const isFavorite = favorites.includes(product.id);
  const currentStock = useMemo(() => product.colors.find(c => c.color === selectedColor)?.stock || 0, [selectedColor, product.colors]);
  const isGlobalOutOfStock = product.colors.every(c => c.stock <= 0);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isGlobalOutOfStock) {
      addToCart({ product, quantity: 1, selectedColor: product.colors[0]?.color || 'Único' });
      // Efecto visual simple de feedback
      alert(`¡${product.name} añadido al carrito! 🌸`);
    }
  };

  return (
    <>
      <div 
        onClick={() => setShowModal(true)}
        className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer border-4 border-transparent hover:border-[#fadb31] flex flex-col h-full relative animate-fadeIn"
      >
        {/* Botón Favorito Flotante */}
        <button 
          onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-125 active:scale-90"
        >
          <svg className={`w-6 h-6 ${isFavorite ? 'text-[#ea7e9c] fill-current' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Contenedor de Imagen Optimizado */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[#fdfaf6] flex items-center justify-center p-4">
          <img 
            src={getImgUrl(product.images[0], 400)} 
            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110" 
            alt={product.name} 
          />
          {isGlobalOutOfStock && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-gray-800 text-white text-sm md:text-lg px-6 py-2 rounded-2xl rotate-12 shadow-2xl font-bold tracking-widest">SIN STOCK</span>
            </div>
          )}
          
          {/* Badge de Oferta si existe precio anterior */}
          {product.oldPrice && product.oldPrice > product.price && (
            <div className="absolute top-4 left-4 bg-[#ea7e9c] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              OFERTA 🔥
            </div>
          )}
        </div>
        
        {/* Info del Producto */}
        <div className="p-5 flex flex-col flex-grow gap-3 bg-white">
          <div className="space-y-1">
            <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest">{product.category}</p>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-[#f6a118] transition-colors h-14">
              {product.name}
            </h3>
          </div>

          <div className="mt-auto flex items-center justify-between border-t-2 border-dashed border-gray-50 pt-4">
            <div className="flex flex-col">
              <span className="text-2xl md:text-3xl font-bold text-[#f6a118] leading-none">
                ${product.price.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-[#ea7e9c] uppercase mt-1">
                + {product.points} pts ✨
              </span>
            </div>
            
            {/* Botón de Añadir Directo */}
            <button 
              onClick={handleQuickAdd}
              className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-white shadow-xl transition-all active:scale-90 ${isGlobalOutOfStock ? 'bg-gray-200 cursor-not-allowed' : 'matita-gradient-orange hover:rotate-12'}`}
            >
               <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
               </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Modal Detallado */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-lg animate-fadeIn">
          <div className="bg-[#fdfaf6] rounded-[3rem] max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col md:flex-row border-8 border-white">
            
            {/* Cerrar */}
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 z-20 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl hover:rotate-90 transition-transform">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* Galería */}
            <div className="md:w-1/2 p-8 bg-white flex flex-col items-center justify-center">
              <div className="w-full aspect-square bg-[#fdfaf6] rounded-[2rem] p-6 flex items-center justify-center overflow-hidden border-2 border-gray-50">
                <img src={getImgUrl(product.images[activeImage], 800)} className="max-w-full max-h-full object-contain" />
              </div>
              <div className="flex gap-3 mt-6 overflow-x-auto pb-2 scrollbar-hide max-w-full px-4">
                {product.images.map((img, idx) => (
                  <button key={idx} onClick={() => setActiveImage(idx)} className={`w-16 h-16 rounded-2xl overflow-hidden border-4 flex-shrink-0 transition-all ${activeImage === idx ? 'border-[#f6a118] scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'}`}>
                    <img src={getImgUrl(img, 150)} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Detalles y Compra */}
            <div className="md:w-1/2 p-10 flex flex-col justify-between space-y-8 bg-[#fdfaf6]">
              <div className="space-y-6">
                <div>
                   <p className="text-[#ea7e9c] font-bold tracking-[0.2em] uppercase text-sm mb-2">{product.category}</p>
                   <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">{product.name}</h2>
                </div>
                
                <p className="text-xl text-gray-500 italic leading-relaxed bg-white/60 p-6 rounded-[2rem] border-2 border-white">
                  "{product.description || 'Un producto mágico seleccionado especialmente para ti.'}"
                </p>

                <div className="space-y-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-8 h-px bg-gray-200"></span> Variantes disponibles <span className="w-8 h-px bg-gray-200"></span>
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map(c => (
                      <button 
                        key={c.color} 
                        onClick={() => c.stock > 0 && setSelectedColor(c.color)} 
                        className={`px-6 py-2.5 rounded-2xl text-lg font-bold border-4 transition-all ${c.stock <= 0 ? 'bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed grayscale' : selectedColor === c.color ? 'matita-gradient-orange text-white border-white shadow-xl scale-105' : 'bg-white text-gray-500 border-white hover:border-[#fadb31]'}`}
                      >
                        {c.color} <span className="text-xs opacity-60 ml-2">({c.stock})</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t-4 border-dashed border-white flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-left">
                  <div className="flex items-center gap-3">
                    {product.oldPrice && (
                      <span className="text-xl text-gray-300 line-through font-bold">${product.oldPrice.toLocaleString()}</span>
                    )}
                    <span className="text-5xl font-bold text-[#f6a118]">${product.price.toLocaleString()}</span>
                  </div>
                  <span className="text-lg font-bold text-[#ea7e9c] uppercase tracking-widest block mt-1">Suma {product.points} puntos 🌸</span>
                </div>
                
                <button 
                  onClick={() => { if(currentStock > 0) { addToCart({ product, quantity: 1, selectedColor }); setShowModal(false); } }} 
                  disabled={currentStock <= 0} 
                  className={`w-full sm:w-auto px-12 py-6 rounded-[2rem] text-3xl font-bold shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 ${currentStock <= 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'matita-gradient-pink text-white hover:scale-105'}`}
                >
                  <span>{currentStock <= 0 ? 'Sin Stock' : '¡Lo Quiero! ✨'}</span>
                  {currentStock > 0 && <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;

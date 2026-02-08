
import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { useApp } from '../App';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, favorites, toggleFavorite, user } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.color || '');
  const [activeImage, setActiveImage] = useState(0);

  const isFavorite = favorites.includes(product.id);

  const currentStock = useMemo(() => {
    return product.colors.find(c => c.color === selectedColor)?.stock || 0;
  }, [selectedColor, product.colors]);

  const handleAddToCart = () => {
    if (currentStock <= 0) {
      alert('¡Vaya! Este color no tiene stock disponible ahora 🌸');
      return;
    }
    addToCart({
      product,
      quantity: 1,
      selectedColor,
    });
    setShowModal(false);
    alert(`✨ ¡${product.name} sumado al carrito!`);
  };

  const isGlobalOutOfStock = product.colors.every(c => c.stock <= 0);

  return (
    <>
      <div 
        onClick={() => setShowModal(true)}
        className="group bg-white rounded-[4rem] overflow-hidden shadow-matita hover:shadow-2xl transition-all cursor-pointer border-4 border-white hover:border-[#fadb31] flex flex-col h-full relative"
      >
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          className="absolute top-8 right-8 z-20 w-16 h-16 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl hover:scale-125 transition-all"
        >
          <svg 
            className={`w-10 h-10 ${isFavorite ? 'text-[#ea7e9c] fill-current' : 'text-gray-200'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        <div className="relative aspect-square overflow-hidden bg-[#fdfaf6] border-b-4 border-gray-50">
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {product.oldPrice && (
            <div className="absolute top-8 left-8 matita-gradient-pink text-white text-xl font-bold px-6 py-3 rounded-full shadow-2xl transform -rotate-6">
              OFERTA ✨
            </div>
          )}
          {isGlobalOutOfStock && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
              <span className="bg-gray-800 text-white text-4xl px-12 py-5 rounded-[2rem] rotate-12 shadow-2xl font-bold">AGOTADO 🌸</span>
            </div>
          )}
        </div>
        
        <div className="p-10 flex flex-col flex-grow gap-6 bg-white">
          <div className="space-y-2">
            <span className="text-xl text-gray-400 font-bold uppercase tracking-[0.2em]">{product.category}</span>
            <h3 className="text-4xl font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-[#f6a118] transition-colors">
              {product.name}
            </h3>
          </div>
          
          <div className="mt-auto pt-8 flex items-end justify-between border-t-4 border-dashed border-gray-50">
            <div className="flex flex-col">
              <div className="flex items-center gap-4">
                 <span className="text-6xl font-bold text-[#f6a118]">${product.price}</span>
                 {product.oldPrice && <span className="text-3xl text-gray-300 line-through">${product.oldPrice}</span>}
              </div>
              {user?.isSocio && <span className="text-xl font-bold text-[#ea7e9c] uppercase mt-2">Suma {product.points} PTS ✨</span>}
            </div>
            <div className="w-20 h-20 matita-gradient-orange rounded-3xl flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-all border-4 border-white">
               <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/70 backdrop-blur-lg animate-fadeIn">
          <div className="bg-[#fdfaf6] rounded-[5rem] max-w-7xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col xl:flex-row border-[12px] border-white animate-fadeIn">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-10 right-10 z-10 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl hover:rotate-90 transition-transform active:scale-90 border-4 border-[#fadb31]/20"
            >
              <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="xl:w-1/2 h-[50vh] xl:h-auto relative bg-white p-12 flex flex-col border-r-8 border-[#fef9eb]">
              <div className="flex-grow rounded-[4rem] overflow-hidden shadow-inner bg-[#fdfaf6] flex items-center justify-center border-4 border-white">
                 <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-contain p-10" />
              </div>
              <div className="flex gap-6 mt-10 justify-center overflow-x-auto py-4 scrollbar-hide">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(idx)}
                    className={`w-28 h-28 rounded-[2rem] overflow-hidden border-4 transition-all ${activeImage === idx ? 'border-[#f6a118] scale-110 shadow-xl' : 'border-white opacity-40'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="xl:w-1/2 p-16 xl:p-24 space-y-12 overflow-y-auto bg-[#fdfaf6] scrollbar-hide">
              <div className="space-y-4">
                <span className="text-[#ea7e9c] font-bold tracking-[0.4em] uppercase text-2xl italic">Librería Matita</span>
                <h2 className="text-8xl font-bold text-gray-800 leading-none">{product.name}</h2>
              </div>
              
              <div className="bg-white p-10 rounded-[4rem] shadow-inner border-4 border-white">
                 <p className="text-3xl text-gray-500 leading-relaxed italic">"{product.description}"</p>
              </div>
              
              <div className="space-y-8">
                <p className="text-3xl font-bold text-gray-700 flex items-center gap-4">
                   Elige tu color favorito:
                </p>
                <div className="flex flex-wrap gap-6">
                  {product.colors.map((c) => (
                    <button
                      key={c.color}
                      onClick={() => c.stock > 0 && setSelectedColor(c.color)}
                      className={`px-10 py-5 rounded-[2.5rem] text-3xl font-bold transition-all border-4 ${
                        c.stock <= 0
                          ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed' 
                          : selectedColor === c.color
                            ? 'matita-gradient-orange text-white border-white shadow-2xl scale-110'
                            : 'bg-white border-white text-gray-500 hover:border-[#fadb31] shadow-lg'
                      }`}
                    >
                      {c.color} {c.stock > 0 ? `(${c.stock})` : '(❌)'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-16 border-t-8 border-white flex flex-col sm:flex-row items-center justify-between gap-12">
                <div className="flex flex-col">
                  <div className="flex items-center gap-8">
                     <span className="text-9xl font-bold text-[#f6a118] tracking-tighter">${product.price}</span>
                     {product.oldPrice && <span className="text-4xl text-gray-300 line-through">${product.oldPrice}</span>}
                  </div>
                  {user?.isSocio && <span className="text-3xl font-bold text-[#ea7e9c] mt-4">Suma {product.points} puntos socio ✨</span>}
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={currentStock <= 0}
                  className={`px-20 py-10 matita-gradient-pink text-white rounded-[4rem] text-6xl font-bold shadow-2xl hover:scale-110 active:scale-95 transition-all w-full sm:w-auto border-8 border-white ${currentStock <= 0 ? 'grayscale opacity-50' : ''}`}
                >
                  {currentStock <= 0 ? 'SIN STOCK' : '¡Lo Quiero! ✨'}
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

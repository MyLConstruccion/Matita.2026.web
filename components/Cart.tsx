import React, { useState } from 'react';
import { useApp } from '../App';

const getImgUrl = (id: string, w = 150) => {
  if (!id) return "";
  if (id.startsWith('data:') || id.startsWith('http')) return id;
  return `https://res.cloudinary.com/dllm8ggob/image/upload/q_auto,f_auto,w_${w}/${id}`;
};

const Cart: React.FC = () => {
  const { cart, removeFromCart, user } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalPoints = cart.reduce((sum, item) => sum + item.product.points * item.quantity, 0);

  const handleReservation = () => {
    const message = `¡Hola Matita! 👋 Soy *${user?.name || 'un cliente'}* y quiero realizar el siguiente pedido:\n\n` + 
      cart.map(item => `📍 *${item.product.name}*\n   🎨 Color: ${item.selectedColor}\n   💰 Precio: $${item.product.price.toLocaleString()}\n`).join('\n') +
      `\n--------------------------\n` +
      `✨ *Subtotal: $${subtotal.toLocaleString()}*\n` +
      `🌸 *Puntos a sumar: ${totalPoints}*\n` +
      `--------------------------\n\n` +
      `¿Me confirman si tienen stock disponible para retirar? ¡Muchas gracias! ✏️✨`;
    
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/5493517587003?text=${encoded}`, '_blank');
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 md:p-5 relative hover:bg-[#fadb31]/20 rounded-full transition-all bg-white shadow-xl md:shadow-2xl border-2 md:border-4 border-white group"
      >
        <svg className="w-8 h-8 md:w-12 md:h-12 text-[#ea7e9c] transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-1 matita-gradient-orange text-white text-xs md:text-xl font-bold w-6 h-6 md:w-10 md:h-10 flex items-center justify-center rounded-full shadow-xl border-2 md:border-4 border-white animate-bounce">
            {cart.length}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Overlay de fondo */}
          <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-md transition-opacity" onClick={() => setIsOpen(false)}></div>
          
          {/* Contenedor Lateral del Carrito */}
          <div className="fixed right-0 top-0 h-full w-full sm:w-[30rem] md:w-[35rem] bg-[#fdfaf6] shadow-2xl z-[70] flex flex-col border-l-4 md:border-l-[12px] border-[#fadb31] animate-fadeIn">
            
            {/* CABECERA (Fija) */}
            <div className="flex-none p-6 md:p-10 matita-gradient-orange text-white flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 md:p-10 opacity-10 rotate-12 text-6xl md:text-9xl">🛍️</div>
              <div className="relative z-10">
                <h3 className="text-3xl md:text-5xl font-bold leading-none mb-1">Mi Carrito</h3>
                <p className="text-sm md:text-xl opacity-90 uppercase tracking-[0.2em] font-bold">Listado de deseos 🌸</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="relative z-10 hover:rotate-90 transition-transform p-2 bg-white/20 rounded-full border-2 border-white/30">
                 <svg className="w-6 h-6 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* CUERPO - LISTA DE PRODUCTOS (Scrollable) */}
            <div className="flex-grow overflow-y-auto p-4 md:p-8 space-y-4 no-scrollbar bg-[#fdfaf6]">
              {cart.length === 0 ? (
                <div className="text-center py-20 flex flex-col items-center">
                  <div className="text-[6rem] opacity-20 mb-4">🛒</div>
                  <p className="text-2xl text-gray-400 font-bold">¡Está vacío!</p>
                  <button onClick={() => setIsOpen(false)} className="mt-6 px-8 py-3 matita-gradient-orange text-white rounded-full font-bold shadow-lg">Volver al Catálogo</button>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center bg-white p-4 rounded-[1.5rem] shadow-sm border-2 border-white relative group hover:border-[#fadb31] transition-all">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                      <img src={getImgUrl(item.product.images[0], 200)} className="w-full h-full object-cover" alt={item.product.name} />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="text-lg font-bold text-gray-800 truncate">{item.product.name}</h4>
                      <p className="text-sm text-gray-400 italic">Variante: {item.selectedColor}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xl font-bold text-[#f6a118]">${item.product.price.toLocaleString()}</span>
                        <button onClick={() => removeFromCart(idx)} className="text-red-300 hover:text-red-500 p-1">
                           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* FOOTER (Fijo al fondo) */}
            {cart.length > 0 && (
              <div className="flex-none p-6 md:p-10 bg-white border-t-4 border-[#fadb31]/30 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-t-[2.5rem] md:rounded-t-[4rem]">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-gray-400 font-bold uppercase tracking-widest text-sm md:text-base">
                    <span>Suma Club ✨</span>
                    <span className="text-[#ea7e9c]">+{totalPoints} pts</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-y-2 border-dashed border-gray-50">
                    <span className="text-2xl md:text-3xl text-gray-800 font-bold">Total:</span>
                    <span className="text-4xl md:text-5xl font-bold text-[#f6a118]">${subtotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button 
                    onClick={handleReservation}
                    className="w-full py-5 md:py-6 matita-gradient-pink text-white rounded-[1.5rem] md:rounded-[2.5rem] text-2xl md:text-3xl font-bold shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 border-4 border-white"
                  >
                    <span>Confirmar</span>
                    <span>🌸</span>
                  </button>
                  <p className="text-center text-gray-400 italic text-xs md:text-sm mt-3">
                    "Coordinaremos el retiro por WhatsApp."
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;

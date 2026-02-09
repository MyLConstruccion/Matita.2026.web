
import React, { useState } from 'react';
import { useApp } from '../App';

const getImgUrl = (id: string, w = 150) => {
  if (!id) return "";
  if (id.startsWith('data:') || id.startsWith('http')) return id;
  return `https://res.cloudinary.com/dllm8ggob/image/upload/q_auto,f_auto,w_${w}/${id}`;
};

const Cart: React.FC = () => {
  const { cart, removeFromCart, clearCart, user } = useApp();
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
        className="p-4 md:p-5 relative hover:bg-[#fadb31]/20 rounded-full transition-all bg-white shadow-2xl border-4 border-white group"
      >
        <svg className="w-10 h-10 md:w-12 md:h-12 text-[#ea7e9c] transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-1 matita-gradient-orange text-white text-xl font-bold w-10 h-10 flex items-center justify-center rounded-full shadow-xl border-4 border-white animate-bounce">
            {cart.length}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-md transition-opacity" onClick={() => setIsOpen(false)}></div>
          <div className="fixed right-0 top-0 h-full w-full sm:w-[35rem] bg-[#fdfaf6] shadow-[-20px_0_60px_rgba(0,0,0,0.2)] z-[70] flex flex-col border-l-[12px] border-[#fadb31] animate-fadeIn">
            
            <div className="p-10 matita-gradient-orange text-white flex justify-between items-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 text-9xl">🛍️</div>
              <div className="relative z-10">
                <h3 className="text-5xl font-bold leading-none mb-2">Mi Carrito</h3>
                <p className="text-xl opacity-90 uppercase tracking-[0.2em] font-bold">Listado de deseos 🌸</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="relative z-10 hover:rotate-90 transition-transform p-2 bg-white/20 rounded-full border-2 border-white/30">
                 <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-8 space-y-6 scrollbar-hide">
              {cart.length === 0 ? (
                <div className="text-center py-32 space-y-8 bg-white/60 rounded-[4rem] border-4 border-white shadow-inner flex flex-col items-center">
                  <div className="text-[10rem] animate-pulse">🛒</div>
                  <div>
                    <p className="text-4xl text-gray-400 font-bold mb-2">¡Está vacío!</p>
                    <p className="text-xl text-gray-300 italic">Llena tu mundo de colores...</p>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="px-12 py-5 matita-gradient-orange text-white rounded-full text-2xl font-bold shadow-lg hover:scale-110 transition-all">Ver Catálogo</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex gap-6 items-center bg-white p-6 rounded-[2.5rem] shadow-lg border-4 border-white relative group hover:border-[#fadb31] transition-all">
                      <div className="w-24 h-24 rounded-3xl overflow-hidden bg-gray-50 flex-shrink-0 shadow-inner border-2 border-gray-50">
                        <img src={getImgUrl(item.product.images[0], 200)} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-500" alt={item.product.name} />
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-2xl font-bold text-gray-800 leading-tight mb-1">{item.product.name}</h4>
                        <div className="flex items-center gap-2 mb-2">
                           <span className="w-3 h-3 rounded-full bg-[#fadb31]"></span>
                           <p className="text-lg text-gray-400">Variante: <span className="text-gray-800 font-bold">{item.selectedColor}</span></p>
                        </div>
                        <div className="flex justify-between items-end">
                          <span className="text-3xl font-bold text-[#f6a118]">${item.product.price.toLocaleString()}</span>
                          <button onClick={() => removeFromCart(idx)} className="text-red-200 hover:text-red-500 hover:scale-110 transition-all p-2 bg-red-50/50 rounded-xl">
                             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-10 bg-white border-t-[8px] border-[#fadb31]/30 space-y-8 shadow-[0_-15px_40px_rgba(0,0,0,0.05)] rounded-t-[4rem]">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl text-gray-400 font-bold uppercase tracking-widest">Suma Club ✨</span>
                    <span className="text-3xl text-[#ea7e9c] font-bold">+{totalPoints} pts</span>
                  </div>
                  <div className="flex justify-between items-center py-4 border-y-4 border-dashed border-gray-50">
                    <span className="text-4xl text-gray-800 font-bold">Total Final:</span>
                    <span className="text-6xl font-bold text-[#f6a118]">${subtotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={handleReservation}
                    className="w-full py-8 matita-gradient-pink text-white rounded-[2.5rem] text-4xl font-bold shadow-2xl hover:scale-[1.03] active:scale-95 transition-all border-4 border-white flex items-center justify-center gap-4"
                  >
                    <span>Confirmar Compra</span>
                    <span className="text-4xl">🌸</span>
                  </button>
                  <p className="text-center text-gray-400 italic text-lg">"Se abrirá WhatsApp para coordinar el retiro."</p>
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


import React, { useState } from 'react';
import { useApp } from '../App';

const Cart: React.FC = () => {
  const { cart, removeFromCart, clearCart } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalPoints = cart.reduce((sum, item) => sum + item.product.points * item.quantity, 0);

  const handleReservation = () => {
    const message = `¡Hola Matita! 👋\n\nQuiero reservar los siguientes tesoros:\n\n` + 
      cart.map(item => `- ${item.product.name} (Color: ${item.selectedColor}): $${item.product.price}`).join('\n') +
      `\n\n*Total a Pagar: $${subtotal}*\n\n¡Espero tu confirmación para el pago! ✨`;
    
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/5493517587003?text=${encoded}`, '_blank');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`¡Alias ${text} copiado! ✨`);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-5 relative hover:bg-[#fadb31]/20 rounded-full transition-all bg-white shadow-xl border-2 border-[#fadb31]/20"
      >
        <svg className="w-12 h-12 text-[#ea7e9c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-1 matita-gradient-orange text-white text-xl font-bold w-10 h-10 flex items-center justify-center rounded-full shadow-2xl border-4 border-white animate-bounce">
            {cart.length}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          <div className="fixed right-0 top-0 h-full w-full sm:w-[40rem] bg-[#fdfaf6] shadow-[-20px_0_50px_rgba(0,0,0,0.2)] z-[70] flex flex-col border-l-[15px] border-[#fadb31] animate-fadeIn">
            
            <div className="p-12 matita-gradient-orange text-white flex justify-between items-center shadow-2xl">
              <div>
                <h3 className="text-6xl font-bold">Mis Tesoros ✨</h3>
                <p className="text-2xl opacity-90">Revisa tu pedido antes de confirmar</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform p-3 bg-white/20 rounded-full">
                 <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-12 space-y-10 scrollbar-hide">
              {cart.length === 0 ? (
                <div className="text-center py-32 space-y-8 bg-white/60 rounded-[5rem] border-4 border-white shadow-inner">
                  <div className="text-[12rem] opacity-20">🎨</div>
                  <p className="text-5xl text-gray-400 italic font-bold">¡Tu carrito está triste!</p>
                  <button onClick={() => setIsOpen(false)} className="px-16 py-6 matita-gradient-orange text-white rounded-full text-3xl font-bold shadow-xl">Ver Catálogo</button>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} className="flex gap-8 items-center bg-white p-8 rounded-[4rem] shadow-xl border-4 border-white group relative">
                    <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden bg-gray-50 flex-shrink-0 shadow-inner">
                      <img src={item.product.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.product.name} />
                    </div>
                    <div className="flex-grow space-y-2">
                      <h4 className="text-4xl font-bold text-gray-800 leading-tight">{item.product.name}</h4>
                      <div className="flex items-center gap-4">
                        <span className="text-xl bg-orange-50 text-[#f6a118] px-4 py-1.5 rounded-full font-bold border border-orange-100 italic">Color: {item.selectedColor}</span>
                        <span className="text-xl bg-pink-50 text-[#ea7e9c] px-4 py-1.5 rounded-full font-bold border border-pink-100">x{item.quantity}</span>
                      </div>
                      <div className="flex justify-between items-center mt-6">
                        <span className="text-5xl font-bold text-[#f6a118]">${item.product.price}</span>
                        <button onClick={() => removeFromCart(idx)} className="text-red-300 hover:text-red-500 transition-colors p-3">
                           <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-12 bg-white border-t-[10px] border-[#fadb31]/20 space-y-10 shadow-inner">
                
                <div className="bg-[#fef9eb] p-10 rounded-[4rem] border-4 border-[#fadb31]/30 space-y-6 shadow-2xl">
                  <h5 className="text-4xl font-bold text-gray-700 flex items-center gap-4 underline decoration-[#fadb31] decoration-4 underline-offset-8">
                    💳 Métodos de Pago
                  </h5>
                  <div className="grid gap-5">
                    {[
                      { alias: 'Matita.2020.mp', label: 'Mercado Pago (Transferencia)' },
                      { alias: 'Matita.2023', label: 'CBU / Alias Bancario' }
                    ].map((m, i) => (
                      <button 
                        key={i}
                        onClick={() => copyToClipboard(m.alias)}
                        className="bg-white px-8 py-6 rounded-3xl text-[#f6a118] font-bold text-3xl border-2 border-[#fadb31]/20 shadow-xl flex justify-between items-center hover:bg-orange-50 transition-colors group"
                      >
                        <span className="flex flex-col items-start">
                          <span className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-1">{m.label}</span>
                          {m.alias}
                        </span>
                        <svg className="w-10 h-10 opacity-30 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 px-4 text-right">
                  <div className="flex justify-between items-center">
                    <span className="text-3xl text-gray-500 italic">Puntos que ganarás:</span>
                    <span className="text-4xl font-bold text-[#ea7e9c]">+{totalPoints} pts ✨</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t-4 border-gray-50">
                    <span className="text-6xl font-bold text-gray-800">Total:</span>
                    <span className="text-8xl font-bold text-[#f6a118] tracking-tighter">${subtotal}</span>
                  </div>
                </div>

                <button 
                  onClick={handleReservation}
                  className="w-full py-10 matita-gradient-pink text-white rounded-[4rem] text-5xl font-bold shadow-2xl hover:scale-105 active:scale-95 border-8 border-white"
                >
                  Confirmar Reserva ✨
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;

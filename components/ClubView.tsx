
import React, { useState } from 'react';
import { useApp } from '../App';
import { Coupon } from '../types';

const MOCK_COUPONS: Coupon[] = [
  { id: 'c1', code: 'MATITA10', discount: 1000, pointsRequired: 500 },
  { id: 'c2', code: 'MATITA20', discount: 2500, pointsRequired: 1200 },
  { id: 'c3', code: 'PROMOVIP', discount: 5000, pointsRequired: 2500 },
];

const ClubView: React.FC = () => {
  const { user, setUser, supabase } = useApp();
  const [redeeming, setRedeeming] = useState<string | null>(null);

  // SI NO ES SOCIO, MOSTRAMOS PANTALLA DE BLOQUEO ELEGANTE
  if (user && !user.isSocio) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-6 animate-fadeIn text-center">
        <div className="bg-white rounded-[4rem] p-16 shadow-matita border-8 border-[#ea7e9c]/20 space-y-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-4 matita-gradient-pink opacity-50"></div>
          <div className="text-[10rem] mb-4">🔐</div>
          <h2 className="text-5xl font-bold text-gray-800">¡Ups! Espacio Exclusivo</h2>
          <p className="text-2xl text-gray-500 italic max-w-2xl mx-auto">
            "Este espacio es solo para los Miembros del Club Matita. Aquí podrás canjear puntos por descuentos reales y regalos sorpresa."
          </p>
          <div className="pt-8">
            <button 
              onClick={() => alert("¡Habla con nosotros por WhatsApp para activarte como Socio! 🌸")}
              className="px-12 py-6 matita-gradient-pink text-white rounded-full text-3xl font-bold shadow-2xl hover:scale-105 transition-all"
            >
              ¡Quiero ser Socio! ✨
            </button>
          </div>
          <p className="text-gray-300 font-bold uppercase tracking-widest text-sm">Cada compra suma magia a tu mundo</p>
        </div>
      </div>
    );
  }

  const handleRedeem = async (coupon: Coupon) => {
    if (!user) return;
    if (user.points < coupon.pointsRequired) {
      alert('¡Aún te faltan algunos puntos para este cupón! 🌸');
      return;
    }

    if (window.confirm(`¿Canjear ${coupon.pointsRequired} puntos por $${coupon.discount} OFF?`)) {
      setRedeeming(coupon.id);
      const newPoints = user.points - coupon.pointsRequired;

      const { error } = await supabase
        .from('users')
        .update({ points: newPoints })
        .eq('id', user.id);
      
      if (!error) {
        setUser({ ...user, points: newPoints });
        alert(`¡Genial! Tu código es ${coupon.code}. Se copió al portapapeles ✨`);
        navigator.clipboard.writeText(coupon.code);
      } else {
        alert('Ups, algo falló al canjear. Reintenta pronto ❌');
      }
      setRedeeming(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-10 animate-fadeIn px-4">
      {/* Tarjeta de Socios */}
      <div className="matita-gradient-orange rounded-[3rem] p-12 text-white shadow-xl relative overflow-hidden border-[6px] border-white">
        <div className="absolute top-0 right-0 p-10 opacity-10 transform rotate-12">
          <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
        </div>
        <div className="relative z-10 space-y-4">
          <h2 className="text-5xl font-bold">¡Hola, {user?.name}! ✨</h2>
          <p className="text-2xl opacity-90 font-bold uppercase tracking-widest">Miembro del Club Matita</p>
          <div className="flex items-baseline gap-4 mt-6">
            <span className="text-9xl font-bold tracking-tighter leading-none">{user?.points}</span>
            <span className="text-3xl font-bold italic uppercase tracking-widest opacity-80">Puntos Disponibles</span>
          </div>
          <p className="text-xl bg-white/30 inline-block px-6 py-2 rounded-full font-bold mt-4 shadow-sm">
            Acumulables en cada compra 🌸
          </p>
        </div>
      </div>

      {/* Sección de Canje */}
      <div className="space-y-8">
        <h3 className="text-5xl font-bold text-gray-800 text-center">Canjea tus Puntos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_COUPONS.map(coupon => (
            <div 
              key={coupon.id} 
              className="bg-white border-4 border-dashed border-[#fadb31] rounded-[2.5rem] p-8 text-center space-y-6 shadow-md hover:scale-105 transition-all"
            >
              <div className="text-6xl">🎁</div>
              <h4 className="text-3xl font-bold text-gray-800">${coupon.discount} de Descuento</h4>
              <p className="text-xl text-gray-400 font-bold tracking-widest uppercase">{coupon.pointsRequired} PUNTOS</p>
              <button 
                onClick={() => handleRedeem(coupon)}
                disabled={redeeming === coupon.id || (user?.points || 0) < coupon.pointsRequired}
                className={`w-full py-5 rounded-[1.5rem] text-2xl font-bold shadow-md ${
                  (user?.points || 0) < coupon.pointsRequired
                    ? 'bg-gray-100 text-gray-300'
                    : 'matita-gradient-pink text-white hover:shadow-lg'
                }`}
              >
                {redeeming === coupon.id ? 'Canjeando...' : 'Canjear ✨'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClubView;

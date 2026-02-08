
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

  const handleRedeem = async (coupon: Coupon) => {
    if (!user) return;
    if (user.points < coupon.pointsRequired) {
      alert('¡Ups! No tienes puntos suficientes todavía.');
      return;
    }

    if (window.confirm(`¿Seguro que quieres canjear ${coupon.pointsRequired} puntos por un cupón de $${coupon.discount}?`)) {
      setRedeeming(coupon.id);
      
      const newPoints = user.points - coupon.pointsRequired;

      const { error } = await supabase
        .from('users')
        .update({ points: newPoints })
        .eq('id', user.id);
      
      if (!error) {
        setUser({ ...user, points: newPoints });
        alert(`¡Felicidades! Tu código es: ${coupon.code}. Se ha copiado al portapapeles.`);
        navigator.clipboard.writeText(coupon.code);
      } else {
        alert('Ocurrió un error al canjear los puntos ❌');
      }
      setRedeeming(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8 animate-fadeIn">
      <div className="matita-gradient-orange rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-20">
          <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <div className="relative z-10 space-y-4">
          <h2 className="text-3xl font-matita font-bold">¡Hola, {user?.name}! ✨</h2>
          <p className="text-xl font-matita opacity-90">Tus puntos acumulados hasta hoy son:</p>
          <div className="text-8xl font-bold flex items-center gap-4">
            {user?.points}
            <span className="text-2xl font-matita font-normal">puntos</span>
          </div>
          <p className="text-lg font-matita bg-white/20 inline-block px-4 py-1 rounded-full">
            ¡Sigue sumando para canjear regalos increíbles!
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-3xl font-matita font-bold text-[#ea7e9c] text-center">Canjea tus Puntos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_COUPONS.map(coupon => (
            <div 
              key={coupon.id} 
              className="bg-white border-2 border-dashed border-[#fadb31] rounded-[2rem] p-6 text-center space-y-4 shadow-matita hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 bg-[#fdfaf6] rounded-full flex items-center justify-center mx-auto text-[#f6a118]">
                 <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
              </div>
              <h4 className="text-2xl font-matita font-bold text-gray-800">Descuento de ${coupon.discount}</h4>
              <p className="text-lg font-matita text-gray-500">{coupon.pointsRequired} puntos</p>
              <button 
                onClick={() => handleRedeem(coupon)}
                disabled={redeeming === coupon.id || (user?.points || 0) < coupon.pointsRequired}
                className={`w-full py-3 rounded-2xl font-matita text-xl font-bold transition-all ${
                  (user?.points || 0) < coupon.pointsRequired
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'matita-gradient-pink text-white shadow-md hover:scale-105 active:scale-95'
                }`}
              >
                {redeeming === coupon.id ? 'Canjeando...' : 'Canjear'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#ea7e9c]/10 rounded-3xl p-8 border border-[#ea7e9c]/20 text-center space-y-4">
         <h4 className="text-2xl font-matita font-bold text-[#ea7e9c]">¿Cómo sumar más?</h4>
         <p className="text-lg font-matita text-gray-600">Por cada $100 de compra sumas 1 punto. ¡Además, en tu cumpleaños te regalamos 100 puntos extras!</p>
      </div>
    </div>
  );
};

export default ClubView;

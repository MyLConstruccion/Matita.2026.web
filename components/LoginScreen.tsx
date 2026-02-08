
import React, { useState } from 'react';
import { useApp } from '../App';

type ViewMode = 'login' | 'register' | 'forgot';

const LoginScreen: React.FC = () => {
  const { setUser, logoUrl, supabase } = useApp();
  const [mode, setMode] = useState<ViewMode>('login');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    isSocio: true
  });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'register') {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (authError) throw authError;

        if (authData.user) {
          const { error: dbError } = await supabase
            .from('users')
            .insert({
              id: authData.user.id,
              email: formData.email,
              name: formData.name,
              points: 100, // Welcome points
              is_admin: false,
              is_socio: formData.isSocio
            });
          
          if (dbError) throw dbError;
          alert('¡Registro exitoso! Ya eres parte del Club Matita ✨');
        }
      } else if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(formData.email);
        if (error) throw error;
        alert('Se ha enviado un correo para restablecer tu contraseña 📧');
        setMode('login');
      }
    } catch (err: any) {
      alert(err.message || 'Ocurrió un error en la autenticación ❌');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    setUser({ 
      id: 'guest', 
      name: 'Visitante', 
      email: 'invitado@matita.com', 
      points: 0, 
      isAdmin: false, 
      isSocio: false 
    });
  };

  return (
    <div className="min-h-screen bg-[#fdfaf6] flex items-center justify-center p-4 md:p-10 relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#fadb31]/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#ea7e9c]/20 rounded-full blur-3xl animate-pulse"></div>

      <div className="bg-white rounded-[4rem] shadow-2xl max-w-xl w-full overflow-hidden border-8 border-white z-10 relative flex flex-col">
        <div className="matita-gradient-orange p-12 text-center relative">
          <div className="w-32 h-32 bg-white rounded-full mx-auto flex items-center justify-center shadow-xl border-4 border-white mb-6 overflow-hidden">
            <img src={logoUrl} className="w-full h-full object-contain p-2" alt="Matita Logo" />
          </div>
          <h1 className="text-6xl font-logo text-white drop-shadow-md">Matita</h1>
          <p className="text-white/90 font-matita text-2xl italic">Papelería con alma ✨</p>
        </div>

        <div className="p-10 md:p-14 space-y-8 bg-white">
          {mode !== 'forgot' && (
            <div className="flex bg-gray-50 p-2 rounded-3xl mb-4">
              <button 
                onClick={() => setMode('login')}
                className={`flex-1 py-3 rounded-2xl font-matita text-2xl font-bold transition-all ${mode === 'login' ? 'bg-white shadow-md text-[#f6a118]' : 'text-gray-400'}`}
              >
                Entrar
              </button>
              <button 
                onClick={() => setMode('register')}
                className={`flex-1 py-3 rounded-2xl font-matita text-2xl font-bold transition-all ${mode === 'register' ? 'bg-white shadow-md text-[#f6a118]' : 'text-gray-400'}`}
              >
                Registrarse
              </button>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-6">
            {mode === 'register' && (
              <div className="space-y-2 animate-fadeIn">
                <label className="font-matita text-xl text-gray-400 ml-4 font-bold uppercase tracking-widest">Nombre Completo</label>
                <input 
                  type="text" 
                  required
                  className="w-full font-matita text-2xl bg-gray-50/50 focus:bg-white"
                  placeholder="Tu nombre aquí..."
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="font-matita text-xl text-gray-400 ml-4 font-bold uppercase tracking-widest">Email</label>
              <input 
                type="email" 
                required
                className="w-full font-matita text-2xl bg-gray-50/50 focus:bg-white"
                placeholder="hola@ejemplo.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-2">
                <label className="font-matita text-xl text-gray-400 ml-4 font-bold uppercase tracking-widest">Contraseña</label>
                <input 
                  type="password" 
                  required
                  className="w-full font-matita text-2xl bg-gray-50/50 focus:bg-white"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            )}

            {mode === 'register' && (
              <label className="flex items-center gap-4 cursor-pointer p-4 bg-orange-50/50 rounded-2xl animate-fadeIn">
                <input 
                  type="checkbox" 
                  checked={formData.isSocio}
                  onChange={e => setFormData({...formData, isSocio: e.target.checked})}
                  className="w-8 h-8 rounded-lg accent-[#f6a118]"
                />
                <div className="flex flex-col">
                  <span className="font-matita font-bold text-gray-700 text-xl">¡Quiero ser socio del Club! ✨</span>
                  <span className="font-matita text-gray-400 text-lg leading-tight">Suma puntos con cada compra y canjea regalos.</span>
                </div>
              </label>
            )}

            <div className="pt-6 flex flex-col gap-5">
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-6 matita-gradient-orange text-white rounded-full font-matita text-3xl font-bold shadow-xl hover:scale-105 transition-all disabled:opacity-50"
              >
                {loading ? 'Procesando...' : mode === 'login' ? 'Entrar al Club 🔒' : mode === 'register' ? 'Unirme Ahora ✨' : 'Mandar Enlace 📧'}
              </button>

              {mode === 'login' && (
                <button 
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-xl font-matita text-gray-400 hover:text-[#ea7e9c] underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              )}

              {mode === 'forgot' && (
                <button 
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xl font-matita text-gray-400 hover:text-[#f6a118] font-bold"
                >
                  Volver al inicio
                </button>
              )}
              
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-300 font-matita text-xl">O también</span></div>
              </div>

              <button 
                type="button"
                onClick={handleGuestLogin}
                className="w-full py-4 bg-white text-gray-400 rounded-full font-matita text-2xl font-bold border-2 border-gray-100 hover:border-[#fadb31] hover:text-[#f6a118] transition-all"
              >
                Continuar como Invitado 🌸
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;

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
        // Registramos en Auth pasando metadatos para el Trigger SQL
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
              isSocio: formData.isSocio
            }
          }
        });

        if (authError) throw authError;
        alert('¡Registro exitoso! Ya puedes iniciar sesión ✨');
        setMode('login');
        
      } else if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;
        // El usuario se setea automáticamente mediante el listener en App.tsx
        
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
    <div className="min-h-screen bg-[#fdfaf6] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Círculos decorativos de fondo */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#fadb31]/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#ea7e9c]/10 rounded-full blur-3xl"></div>

      <div className="bg-white rounded-[3rem] md:rounded-[4rem] shadow-2xl max-w-xl w-full overflow-hidden border-4 md:border-8 border-white z-10 relative flex flex-col transition-all duration-500">
        
        {/* Header con gradiente Matita */}
        <div className="matita-gradient-orange p-8 md:p-12 text-center relative">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full mx-auto flex items-center justify-center shadow-xl border-4 border-white mb-4 overflow-hidden animate-float">
            <img src={logoUrl} className="w-full h-full object-contain p-2" alt="Matita Logo" />
          </div>
          <h1 className="text-4xl md:text-6xl font-logo text-white drop-shadow-md">Matita</h1>
          <p className="text-white/90 text-lg md:text-2xl italic">Papelería con alma ✨</p>
        </div>

        <div className="p-8 md:p-14 space-y-6 bg-white">
          {/* Selector de modo */}
          {mode !== 'forgot' && (
            <div className="flex bg-gray-100/50 p-2 rounded-[2rem] mb-4 border border-gray-100">
              <button 
                onClick={() => setMode('login')}
                className={`flex-1 py-3 rounded-[1.5rem] text-xl font-bold transition-all ${mode === 'login' ? 'bg-white shadow-lg text-[#f6a118]' : 'text-gray-400'}`}
              >
                Entrar
              </button>
              <button 
                onClick={() => setMode('register')}
                className={`flex-1 py-3 rounded-[1.5rem] text-xl font-bold transition-all ${mode === 'register' ? 'bg-white shadow-lg text-[#f6a118]' : 'text-gray-400'}`}
              >
                Registrarse
              </button>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            {mode === 'register' && (
              <div className="space-y-1 animate-slideUp">
                <label className="text-sm text-gray-400 ml-4 font-bold uppercase tracking-widest">Nombre Completo</label>
                <input 
                  type="text" 
                  required
                  className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#fadb31] outline-none text-xl transition-all"
                  placeholder="Tu nombre aquí..."
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm text-gray-400 ml-4 font-bold uppercase tracking-widest">Email</label>
              <input 
                type="email" 
                required
                className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#fadb31] outline-none text-xl transition-all"
                placeholder="hola@ejemplo.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-1">
                <label className="text-sm text-gray-400 ml-4 font-bold uppercase tracking-widest">Contraseña</label>
                <input 
                  type="password" 
                  required
                  className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#fadb31] outline-none text-xl transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            )}

            {mode === 'register' && (
              <label className="flex items-center gap-4 cursor-pointer p-4 bg-orange-50/50 rounded-2xl border border-orange-100 animate-slideUp">
                <input 
                  type="checkbox" 
                  checked={formData.isSocio}
                  onChange={e => setFormData({...formData, isSocio: e.target.checked})}
                  className="w-6 h-6 rounded accent-[#f6a118]"
                />
                <div className="flex flex-col">
                  <span className="font-bold text-gray-700">¡Quiero ser socio del Club! ✨</span>
                  <span className="text-sm text-gray-400 leading-tight">Suma puntos con cada compra.</span>
                </div>
              </label>
            )}

            <div className="pt-4 flex flex-col gap-4">
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 matita-gradient-orange text-white rounded-full text-2xl font-bold shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? 'Cargando...' : mode === 'login' ? 'Entrar al Club 🔒' : mode === 'register' ? 'Unirme Ahora ✨' : 'Mandar Enlace 📧'}
              </button>

              {mode === 'login' && (
                <button 
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-lg text-gray-400 hover:text-[#ea7e9c] underline transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              )}
              
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                <div className="relative flex justify-center text-xs uppercase tracking-[0.3em]"><span className="px-4 bg-white text-gray-300">O también</span></div>
              </div>

              <button 
                type="button"
                onClick={handleGuestLogin}
                className="w-full py-4 bg-white text-gray-400 rounded-full text-xl font-bold border-2 border-gray-100 hover:border-[#fadb31] hover:text-[#f6a118] transition-all shadow-sm"
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

import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import Cart from './Cart';

const Layout: React.FC = () => {
  const { user, setUser, clearCart, logoUrl } = useApp();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const bannerImages = [
    "https://res.cloudinary.com/demo/image/upload/v1652345767/docs/site/product_image_1.jpg",
    "https://res.cloudinary.com/demo/image/upload/v1652345767/docs/site/product_image_2.jpg",
    "https://res.cloudinary.com/demo/image/upload/v1652345767/docs/site/product_image_3.jpg"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('matita_user');
    setUser(null);
    clearCart();
    navigate('/login');
  };

  const navItems = [
    { label: 'Catálogo', path: '/catalog' },
    { label: 'Favoritos', path: '/favorites' },
    { label: 'Novedades', path: '/novelties' },
    { label: 'Ideas', path: '/ideas' },
    { label: 'Contacto', path: '/contact' },
  ];

  if (user?.isSocio) {
    navItems.splice(2, 0, { label: 'Mi Club', path: '/club' });
  }

  return (
    <div className="min-h-screen flex flex-col font-matita bg-[#fffdf9]">
      {/* SECCIÓN 1: Banner Superior - Altura adaptable */}
      <section className="w-full h-32 md:h-72 relative overflow-hidden border-b-4 md:border-b-8 border-[#fadb31] shadow-2xl">
        {bannerImages.map((img, idx) => (
          <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
            <img src={img} className="w-full h-full object-cover" alt={`Banner ${idx + 1}`} />
          </div>
        ))}
        <div className="absolute inset-0 bg-black/10"></div>
      </section>

      {/* SECCIÓN 2: Header Principal */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 py-4 md:py-8 shadow-xl border-b-2 md:border-b-4 border-[#fadb31]/30">
        <div className="container mx-auto px-4 md:px-6 flex flex-col items-center gap-4 md:gap-8">
          <div className="flex items-center justify-between w-full max-w-7xl">
             <NavLink to="/" className="flex items-center gap-3 md:gap-6 group">
                <div className="w-16 h-16 md:w-32 md:h-32 bg-[#fadb31] rounded-full flex items-center justify-center shadow-xl transition-all duration-700 group-hover:rotate-12 border-2 md:border-4 border-white overflow-hidden">
                  <img src={logoUrl} alt="Matita" className="w-full h-full object-contain p-1.5 md:p-2" />
                </div>
                <div>
                    <h1 className="font-logo text-4xl md:text-9xl text-gray-800 tracking-tighter leading-none">Matita</h1>
                    <p className="text-xs md:text-2xl text-[#f6a118] italic ml-1">Librería & Papelería ✨</p>
                </div>
             </NavLink>

             <div className="flex items-center gap-3 md:gap-6">
                <div className="hidden md:flex items-center gap-8">
                   {user?.isSocio && (
                      <div className="text-right bg-[#fef9eb] px-6 py-2 rounded-3xl border-2 border-[#fadb31]/20 shadow-inner">
                         <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Mis Puntos</p>
                         <p className="text-3xl font-bold text-[#f6a118]">{user?.points || 0} ✨</p>
                      </div>
                   )}
                   <Cart />
                   <button onClick={handleLogout} className="px-10 py-3 matita-gradient-pink text-white rounded-full text-2xl shadow-xl hover:scale-110 font-bold transition-transform">
                    Salir
                   </button>
                </div>
                
                {/* Botón Menu Móvil y Carrito Móvil */}
                <div className="flex md:hidden items-center gap-2">
                  <Cart />
                  <button onClick={() => setIsMenuOpen(true)} className="p-2 text-[#f6a118]">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                  </button>
                </div>
             </div>
          </div>

          {/* Nav para Escritorio - Oculto en móviles */}
          <nav className="hidden md:flex items-center justify-center gap-x-10 w-full py-4">
            {navItems.map((item) => (
              <NavLink 
                key={item.path} 
                to={item.path} 
                className={({ isActive }) =>
                  `text-2xl font-bold transition-all transform hover:scale-110 whitespace-nowrap pb-2 ${
                    isActive ? 'text-[#f6a118] border-b-4 border-[#fadb31]' : 'text-gray-400 hover:text-[#ea7e9c]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Menú Móvil Fullscreen */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-[100] bg-[#fdfaf6] p-8 flex flex-col items-center animate-slideInRight">
            <button onClick={() => setIsMenuOpen(false)} className="self-end text-5xl text-[#f6a118] mb-8">✕</button>
            
            <div className="w-24 h-24 bg-[#fadb31] rounded-full flex items-center justify-center shadow-xl border-4 border-white overflow-hidden mb-12">
              <img src={logoUrl} alt="Matita" className="w-full h-full object-contain p-2" />
            </div>

            <div className="flex flex-col items-center gap-8 w-full">
              {navItems.map((item) => (
                <NavLink 
                  key={item.path} 
                  to={item.path} 
                  onClick={() => setIsMenuOpen(false)} 
                  className={({ isActive }) => `text-4xl font-bold ${isActive ? 'text-[#f6a118]' : 'text-gray-700'}`}
                >
                  {item.label}
                </NavLink>
              ))}
              
              <hr className="w-full border-t-2 border-[#fadb31]/20 my-4" />
              
              {user?.isSocio && (
                <div className="text-center bg-[#fef9eb] w-full py-6 rounded-3xl border-2 border-[#fadb31]/20">
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Mis Puntos acumulados</p>
                  <p className="text-5xl font-bold text-[#f6a118]">{user.points} ✨</p>
                </div>
              )}

              <button onClick={handleLogout} className="w-full py-6 matita-gradient-pink text-white rounded-[2rem] text-3xl font-bold shadow-2xl mt-4">
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </header>

      {/* SECCIÓN 3: Área de productos */}
      <main className="w-full flex-grow py-6 md:py-12">
        <div className="container mx-auto px-4 md:px-10 max-w-screen-2xl">
          <div className="products-display-area">
             <Outlet />
          </div>
        </div>
      </main>

      {/* SECCIÓN 4: Footer Matita */}
      <footer className="bg-[#fadb31]/10 border-t-4 md:border-t-[10px] border-[#fadb31]/40 py-12 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 left-5 md:left-10 text-[5rem] md:text-[10rem] opacity-5 rotate-12 pointer-events-none">✏️</div>
        <div className="absolute bottom-5 md:bottom-10 right-5 md:right-10 text-[5rem] md:text-[10rem] opacity-5 -rotate-12 pointer-events-none">🎨</div>

        <div className="container mx-auto px-6 md:px-8 flex flex-col items-center text-center space-y-12 md:space-y-16">
           <div className="flex items-center gap-4 md:gap-6">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-full p-2 md:p-4 shadow-2xl border-2 md:border-4 border-[#fadb31]"><img src={logoUrl} className="w-full h-full object-contain" alt="Footer Logo" /></div>
              <h2 className="text-5xl md:text-7xl font-logo text-gray-800">Matita</h2>
           </div>
           
           <div className="flex flex-col md:flex-row gap-8 md:gap-16 text-xl md:text-3xl text-gray-500 font-bold">
              <a href="https://instagram.com/libreriamatita" target="_blank" rel="noreferrer" className="hover:text-[#ea7e9c] transition-colors flex items-center justify-center gap-4">
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" className="w-8 h-8 md:w-10 md:h-10" alt="" /> @libreriamatita
              </a>
              <a href="https://wa.me/5493517587003" target="_blank" rel="noreferrer" className="hover:text-[#f6a118] transition-colors flex items-center justify-center gap-4">
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-8 h-8 md:w-10 md:h-10" alt="" /> WhatsApp
              </a>
              <p className="flex items-center justify-center gap-2">📍 La Calera, Córdoba</p>
           </div>

           <div className="bg-white/80 backdrop-blur-md p-6 md:p-10 rounded-[2rem] md:rounded-[4rem] border-2 md:border-4 border-dashed border-[#fadb31] max-w-4xl shadow-inner mx-4">
              <p className="text-xl md:text-3xl text-gray-500 italic leading-relaxed">
                "En Matita creemos que los detalles hacen la diferencia. Cada color cuenta tu historia única." 🌸
              </p>
           </div>

           <div className="pt-10 md:pt-20 border-t-2 md:border-t-4 border-white w-full max-w-3xl flex flex-col items-center gap-6 md:gap-8">
             <p className="text-sm md:text-xl text-gray-400 uppercase tracking-[0.3em] md:tracking-[0.4em] font-bold text-center">Gestión Interna</p>
             <NavLink to="/admin" className="group flex flex-col items-center gap-4 hover:scale-105 transition-transform">
                <div className="w-16 h-16 md:w-24 md:h-24 matita-gradient-orange rounded-full flex items-center justify-center shadow-xl border-2 md:border-4 border-white">
                   <span className="text-3xl md:text-6xl group-hover:rotate-12 transition-transform">✏️</span>
                </div>
                <span className="text-xl md:text-3xl font-bold text-gray-700">Entrar al Panel Admin</span>
             </NavLink>
           </div>

           <p className="text-sm md:text-lg text-gray-400 opacity-60 italic">© 2026 Matita Librería • La Calera, CBA</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

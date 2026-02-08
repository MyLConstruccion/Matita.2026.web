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
      {/* 1. Banner Superior (No sticky) */}
      <section className="w-full h-32 md:h-48 relative overflow-hidden border-b-4 border-[#fadb31] shadow-md">
        {bannerImages.map((img, idx) => (
          <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
            <img src={img} className="w-full h-full object-cover" alt={`Banner ${idx + 1}`} />
          </div>
        ))}
        <div className="absolute inset-0 bg-white/10"></div>
      </section>

      {/* 2. Header Principal (Cambiado de sticky a relative para que fluya con el scroll) */}
      <header className="bg-white py-8 shadow-sm">
        <div className="container mx-auto px-6 flex flex-col items-center gap-6">
          
          {/* Logo y Acciones */}
          <div className="flex items-center justify-between w-full max-w-6xl">
             <NavLink to="/" className="flex items-center gap-4 group">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-[#fadb31] rounded-full flex items-center justify-center shadow-lg border-4 border-white overflow-hidden">
                  <img src={logoUrl} alt="Matita" className="w-full h-full object-contain p-2" />
                </div>
                <div>
                    <h1 className="font-logo text-6xl md:text-7xl text-gray-800 leading-none">Matita</h1>
                    <p className="text-lg text-[#f6a118] italic font-medium">Librería & Papelería ✨</p>
                </div>
             </NavLink>

             <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-6">
                   {user?.isSocio && (
                      <div className="text-right bg-[#fef9eb] px-4 py-1 rounded-2xl border border-[#fadb31]/30">
                         <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Puntos</p>
                         <p className="text-xl font-bold text-[#f6a118]">{user?.points || 0} ✨</p>
                      </div>
                   )}
                   <Cart />
                   <button onClick={handleLogout} className="px-6 py-2 matita-gradient-orange text-white rounded-full text-lg font-bold shadow-md hover:scale-105 transition-transform">
                    Salir
                   </button>
                </div>
                {/* Mobile Menu Button */}
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-[#f6a118]">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                </button>
             </div>
          </div>

          {/* Nav Principal */}
          <nav className="flex items-center justify-center overflow-x-auto no-scrollbar gap-x-8 w-full py-4 border-t border-gray-50">
            {navItems.map((item) => (
              <NavLink 
                key={item.path} 
                to={item.path} 
                className={({ isActive }) =>
                  `text-xl font-bold transition-all whitespace-nowrap pb-1 ${
                    isActive ? 'text-[#f6a118] border-b-4 border-[#fadb31]' : 'text-gray-400 hover:text-[#ea7e9c]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center gap-8 p-10 animate-fadeIn">
            <button onClick={() => setIsMenuOpen(false)} className="absolute top-10 right-10 text-4xl text-gray-400">✕</button>
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} onClick={() => setIsMenuOpen(false)} className="text-4xl font-bold text-gray-700">
                {item.label}
              </NavLink>
            ))}
            <button onClick={handleLogout} className="mt-4 px-12 py-4 matita-gradient-pink text-white rounded-full text-2xl font-bold">Cerrar Sesión</button>
          </div>
        )}
      </header>

      {/* Contenido Principal */}
      <main className="container mx-auto flex-grow px-6 py-10">
        <Outlet />
      </main>

      {/* Footer (Simplificado para no distraer) */}
      <footer className="bg-white border-t-2 border-[#fadb31]/20 py-12">
        <div className="container mx-auto px-8 flex flex-col items-center text-center space-y-6">
           <div className="flex flex-col md:flex-row gap-8 text-xl text-gray-400">
              <a href="https://instagram.com/libreriamatita" target="_blank" className="hover:text-[#ea7e9c] flex items-center gap-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" className="w-6 h-6" alt="" /> @libreriamatita
              </a>
              <p>📍 La Calera, Córdoba</p>
           </div>
           <p className="text-sm text-gray-300 italic">© 2026 Matita Librería</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

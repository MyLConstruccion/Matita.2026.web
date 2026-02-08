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
  }, [bannerImages.length]);

  const handleLogout = () => {
    localStorage.removeItem('matita_user');
    setUser(null);
    clearCart();
    navigate('/login');
  };

  // Definimos navItems base
  let navItems = [
    { label: 'Catálogo', path: '/catalog' },
    { label: 'Escolar', path: '/escolar' },
    { label: 'Regalaría', path: '/regalaria' },
    { label: 'Oficina', path: '/oficina' },
    { label: 'Favoritos', path: '/favorites' },
    { label: 'Novedades', path: '/novelties' },
    { label: 'Ofertas', path: '/ofertas' },
    { label: 'Ideas', path: '/ideas' },
    { label: 'Contacto', path: '/contact' },
  ];

  // Insertar "Mi Club" solo si es socio
  if (user?.isSocio) {
    navItems.splice(7, 0, { label: 'Mi Club', path: '/club' });
  }

  return (
    <div className="min-h-screen flex flex-col font-matita bg-[#fdfaf6]">
      {/* 1. Carrusel Superior */}
      <section className="w-full h-48 md:h-80 relative overflow-hidden border-b-8 border-[#fadb31] shadow-inner">
        {bannerImages.map((img, idx) => (
          <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
            <img src={img} className="w-full h-full object-cover" alt={`Banner ${idx + 1}`} />
          </div>
        ))}
        <div className="absolute inset-0 bg-black/10"></div>
      </section>

      {/* 2. Header Sticky */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 py-6 shadow-2xl border-b-4 border-[#fadb31]/30">
        <div className="container mx-auto px-6 flex flex-col items-center gap-8">
          <div className="flex items-center justify-between w-full max-w-7xl">
            <NavLink to="/" className="flex items-center gap-6 group">
              <div className="w-20 h-20 md:w-32 md:h-32 bg-[#fadb31] rounded-full flex items-center justify-center shadow-2xl transition-all duration-700 group-hover:rotate-12 border-4 border-white overflow-hidden">
                <img src={logoUrl} alt="Matita" className="w-full h-full object-contain p-2" />
              </div>
              <div>
                <h1 className="font-logo text-5xl md:text-9xl text-gray-800 tracking-tighter leading-none">Matita</h1>
                <p className="text-lg md:text-2xl text-[#f6a118] italic ml-2">Librería & Papelería ✨</p>
              </div>
            </NavLink>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-8">
                {user?.isSocio && (
                  <div className="text-right bg-[#fef9eb] px-6 py-2 rounded-3xl border-2 border-[#fadb31]/20">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Mis Puntos</p>
                    <p className="text-3xl font-bold text-[#f6a118]">{user?.points || 0} ✨</p>
                  </div>
                )}
                <Cart />
                <button onClick={handleLogout} className="px-10 py-3 matita-gradient-pink text-white rounded-full text-2xl shadow-xl hover:scale-110 font-bold transition-transform">Salir</button>
              </div>
              
              {/* Botón Hamburguesa Móvil */}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-3 text-[#f6a118] bg-[#fef9eb] rounded-full shadow-md">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                </svg>
              </button>
            </div>
          </div>

          {/* Nav con Scroll Horizontal (Desktop & Mobile) */}
          <nav className="flex items-center justify-start md:justify-center overflow-x-auto no-scrollbar gap-x-8 gap-y-2 w-full px-4 py-2 border-t border-gray-50 md:border-none">
            {navItems.map((item) => (
              <NavLink 
                key={item.path} 
                to={item.path} 
                className={({ isActive }) =>
                  `text-xl md:text-2xl font-bold transition-all whitespace-nowrap pb-1 ${
                    isActive ? 'text-[#f6a118] border-b-4 border-[#fadb31]' : 'text-gray-400 hover:text-[#ea7e9c]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Menú Móvil Overlay */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-[100%] bg-[#fdfaf6] border-t-8 border-[#fadb31] py-10 px-10 flex flex-col items-center gap-8 animate-fadeIn shadow-2xl z-50 h-[calc(100vh-200px)] overflow-y-auto">
             <div className="flex items-center gap-6 bg-white p-6 rounded-[2rem] shadow-inner w-full justify-center">
                <Cart />
                {user?.isSocio && <p className="text-4xl font-bold text-[#f6a118]">{user.points} pts ✨</p>}
             </div>
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} onClick={() => setIsMenuOpen(false)} className="text-4xl font-bold text-gray-700 hover:text-[#f6a118]">
                {item.label}
              </NavLink>
            ))}
            <button onClick={handleLogout} className="w-full py-6 matita-gradient-pink text-white rounded-[2rem] text-3xl font-bold shadow-xl mt-4">Cerrar Sesión 🚪</button>
          </div>
        )}
      </header>

      {/* 3. Contenido Principal */}
      <main className="container mx-auto flex-grow px-6 py-10 relative z-10 max-w-7xl">
        <Outlet />
      </main>

      {/* 4. Footer Artístico */}
      <footer className="bg-[#fadb31]/10 border-t-[10px] border-[#fadb31]/40 py-24 relative overflow-hidden">
        <div className="absolute top-0 left-10 text-[10rem] opacity-5 rotate-12 pointer-events-none">✏️</div>
        <div className="absolute bottom-10 right-10 text-[10rem] opacity-5 -rotate-12 pointer-events-none">🎨</div>

        <div className="container mx-auto px-8 flex flex-col items-center text-center space-y-16">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white rounded-full p-4 shadow-2xl border-4 border-[#fadb31]">
              <img src={logoUrl} className="w-full h-full object-contain" alt="Footer Logo" />
            </div>
            <h2 className="text-6xl md:text-8xl font-logo text-gray-800">Matita</h2>
          </div>
           
          <div className="flex flex-col md:flex-row gap-10 md:gap-20 text-2xl md:text-3xl text-gray-500 font-bold">
            <a href="https://instagram.com/libreriamatita" target="_blank" rel="noreferrer" className="hover:text-[#ea7e9c] transition-colors flex items-center justify-center gap-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" className="w-10 h-10" alt="" /> @libreriamatita
            </a>
            <a href="https://wa.me/5493517587003" target="_blank" rel="noreferrer" className="hover:text-[#25D366] transition-colors flex items-center justify-center gap-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-10 h-10" alt="" /> WhatsApp
            </a>
            <p>📍 La Calera, Córdoba</p>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-[3rem] md:rounded-[4rem] border-4 border-dashed border-[#fadb31] max-w-4xl shadow-inner">
            <p className="text-2xl md:text-3xl text-gray-500 italic leading-relaxed">
              "En Matita creemos que los detalles hacen la diferencia. Cada color cuenta tu historia única." 🌸
            </p>
          </div>

          <div className="pt-20 border-t-4 border-white w-full max-w-3xl flex flex-col items-center gap-8">
            <p className="text-xl text-gray-400 uppercase tracking-[0.4em] font-bold">Gestión Interna</p>
            <NavLink to="/admin" className="group flex flex-col items-center gap-4 hover:scale-110 transition-transform">
              <div className="w-20 h-20 matita-gradient-orange rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
                <span className="text-5xl group-hover:rotate-12 transition-transform">⚙️</span>
              </div>
              <span className="text-2xl font-bold text-gray-700">Panel Admin</span>
            </NavLink>
          </div>

          <p className="text-lg text-gray-400 opacity-60 italic pt-10">© 2026 Matita Librería • La Calera, CBA</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

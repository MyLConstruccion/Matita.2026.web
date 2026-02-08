
import React, { useState, useRef, useEffect } from 'react';
import { Product, Category, User, Sale, ColorStock } from '../types';
import { useApp } from '../App';

const AdminPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'inventory' | 'sales' | 'socios' | 'ideas' | 'design'>('inventory');

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'matita2026') setIsAuthenticated(true);
    else alert('Contraseña incorrecta ❌');
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto py-40 animate-fadeIn px-6">
        <div className="bg-[#fef9eb] rounded-[4rem] p-16 shadow-2xl border-8 border-white space-y-12 text-center">
          <div className="text-9xl mb-4">🔑</div>
          <h2 className="text-6xl font-bold text-gray-800">Acceso Maestro</h2>
          <form onSubmit={handleAdminAuth} className="space-y-10">
            <input 
              type="password" 
              placeholder="Clave Matita" 
              className="w-full text-4xl text-center shadow-inner" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <button className="w-full py-8 matita-gradient-orange text-white rounded-[2.5rem] text-4xl font-bold shadow-2xl hover:scale-105">
              Entrar al Panel
            </button>
          </form>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto space-y-16 py-10 animate-fadeIn">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 border-b-8 border-[#fadb31]/20 pb-12 px-6">
        <div className="space-y-4">
          <h2 className="text-8xl font-bold text-[#f6a118] drop-shadow-md">Panel Admin</h2>
          <p className="text-4xl text-gray-400 italic font-medium ml-2">La Calera, CBA ✨</p>
        </div>
        <div className="flex flex-wrap gap-5 justify-center">
          {[
            { id: 'inventory', label: '📦 Stock' },
            { id: 'sales', label: '📈 Ventas' },
            { id: 'socios', label: '👑 Socios' },
            { id: 'ideas', label: '💡 Ideas' },
            { id: 'design', label: '🎨 Marca' }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)} 
              className={`px-12 py-6 rounded-[2.5rem] text-3xl font-bold transition-all shadow-xl border-4 ${activeTab === tab.id ? 'matita-gradient-orange text-white border-white scale-110' : 'bg-white text-gray-400 border-transparent hover:text-[#f6a118]'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-[5rem] shadow-matita p-8 md:p-24 border-[12px] border-white relative overflow-hidden">
        {activeTab === 'inventory' && <InventoryManager />}
        {activeTab === 'sales' && <SalesManager />}
        {activeTab === 'socios' && <SociosManager />}
        {activeTab === 'ideas' && <IdeasManager />}
        {activeTab === 'design' && <DesignManager />}
      </div>
    </div>
  );
};

const InventoryManager: React.FC = () => {
  const { supabase } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [formMode, setFormMode] = useState<'list' | 'create' | 'edit'>('list');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories: Category[] = ['Escolar', 'Regalaría', 'Oficina', 'Tecnología', 'Novedades', 'Ofertas'];

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) {
      setProducts(data.map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        oldPrice: p.old_price,
        points: p.points,
        category: p.category,
        images: p.images || [],
        colors: p.colors || []
      })));
    }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, [supabase]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onloadend = () => {
         const base64 = reader.result as string;
         setEditingProduct(prev => ({...prev, images: [...(prev?.images || []), base64]}));
      };
      reader.readAsDataURL(files[i]);
    }
  };

  const handleSave = async () => {
    if (!editingProduct?.name || !editingProduct?.price) return alert('¡Faltan datos! 🌸');
    setLoading(true);
    const payload = {
      name: editingProduct.name,
      description: editingProduct.description,
      price: editingProduct.price,
      old_price: editingProduct.oldPrice,
      points: editingProduct.points,
      category: editingProduct.category,
      images: editingProduct.images,
      colors: editingProduct.colors
    };

    let error;
    if (formMode === 'edit' && editingProduct.id) {
      const { error: err } = await supabase.from('products').update(payload).eq('id', editingProduct.id);
      error = err;
    } else {
      const { error: err } = await supabase.from('products').insert(payload);
      error = err;
    }
    
    if (error) alert(error.message);
    else { alert('✨ Éxito ✨'); setFormMode('list'); fetchProducts(); }
    setLoading(false);
  };

  if (formMode === 'list') {
    return (
      <div className="space-y-12">
        <div className="flex justify-between items-center">
          <h3 className="text-6xl font-bold text-gray-800">Mi Stock 📦</h3>
          <button onClick={() => { setEditingProduct({ name: '', price: 0, points: 0, category: 'Escolar', colors: [{color: 'Único', stock: 10}], images: [] }); setFormMode('create'); }} className="px-12 py-6 matita-gradient-orange text-white rounded-[2.5rem] text-4xl font-bold shadow-2xl">+ Nuevo</button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {products.map(p => (
            <div key={p.id} className="bg-white rounded-[4rem] p-8 shadow-xl border-4 border-transparent hover:border-[#fadb31] transition-all">
              <div className="aspect-square rounded-[3rem] overflow-hidden bg-gray-50 mb-8 border-4 border-white shadow-inner relative">
                 <img src={p.images[0]} className="w-full h-full object-cover" />
                 <span className="absolute top-4 right-4 bg-white/90 px-4 py-2 rounded-full font-bold text-xl text-[#f6a118]">{p.category}</span>
              </div>
              <h4 className="text-4xl font-bold text-gray-800 mb-2">{p.name}</h4>
              <p className="text-5xl font-bold text-[#f6a118] mb-6">${p.price}</p>
              <div className="flex gap-4">
                <button onClick={() => { setEditingProduct(p); setFormMode('edit'); }} className="flex-grow py-5 bg-[#fadb31]/20 text-[#f6a118] rounded-[2rem] text-2xl font-bold">Editar ✏️</button>
                <button onClick={async () => { if(confirm('¿Borrar?')) { await supabase.from('products').delete().eq('id', p.id); fetchProducts(); } }} className="px-8 py-5 bg-red-50 text-red-400 rounded-[2rem] text-2xl">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-24">
      <div className="space-y-12">
        <button onClick={() => setFormMode('list')} className="text-5xl mb-8">🔙 Volver</button>
        <div className="space-y-10">
          <div className="space-y-4">
            <label className="text-3xl font-bold text-gray-400 ml-4">Nombre del Tesoro</label>
            <input type="text" className="w-full text-4xl" value={editingProduct?.name} onChange={e => setEditingProduct({...editingProduct!, name: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-3xl font-bold text-gray-400 ml-4">Precio Actual ($)</label>
              <input type="number" className="w-full text-4xl" value={editingProduct?.price} onChange={e => setEditingProduct({...editingProduct!, price: parseFloat(e.target.value)})} />
            </div>
            <div className="space-y-4">
              <label className="text-3xl font-bold text-gray-400 ml-4">Precio Antiguo ($)</label>
              <input type="number" className="w-full text-4xl" value={editingProduct?.oldPrice || ''} onChange={e => setEditingProduct({...editingProduct!, oldPrice: e.target.value ? parseFloat(e.target.value) : undefined})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-3xl font-bold text-gray-400 ml-4">Categoría</label>
              <select className="w-full text-4xl px-8" value={editingProduct?.category} onChange={e => setEditingProduct({...editingProduct!, category: e.target.value as Category})}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-4">
              <label className="text-3xl font-bold text-gray-400 ml-4">Puntos Socio</label>
              <input type="number" className="w-full text-4xl" value={editingProduct?.points} onChange={e => setEditingProduct({...editingProduct!, points: parseInt(e.target.value)})} />
            </div>
          </div>
          <div className="space-y-8">
            <div className="flex justify-between items-center px-4">
               <label className="text-3xl font-bold text-gray-400 uppercase tracking-widest">Colores y Stock</label>
               <button onClick={() => setEditingProduct({...editingProduct!, colors: [...(editingProduct?.colors || []), { color: 'Nuevo', stock: 1 }]})} className="text-[#f6a118] text-3xl font-bold underline">+ Agregar Color</button>
            </div>
            {editingProduct?.colors?.map((c, idx) => (
              <div key={idx} className="flex gap-6 bg-white p-8 rounded-[3rem] border-4 border-white shadow-xl items-center">
                <input type="checkbox" checked={c.stock > 0} onChange={(e) => {
                  const next = [...(editingProduct.colors || [])];
                  next[idx].stock = e.target.checked ? Math.max(1, next[idx].stock) : 0;
                  setEditingProduct({...editingProduct, colors: next});
                }} className="w-12 h-12 accent-[#f6a118] rounded-xl" />
                <input type="text" className="flex-grow text-3xl border-none bg-gray-50" value={c.color} onChange={e => {
                  const next = [...(editingProduct.colors || [])];
                  next[idx].color = e.target.value;
                  setEditingProduct({...editingProduct, colors: next});
                }} />
                <input type="number" className="w-32 text-3xl text-center border-none bg-gray-50" value={c.stock} onChange={e => {
                  const next = [...(editingProduct.colors || [])];
                  next[idx].stock = parseInt(e.target.value);
                  setEditingProduct({...editingProduct, colors: next});
                }} />
              </div>
            ))}
          </div>
          <div className="pt-10 space-y-8">
             <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept="image/*" multiple />
             <button onClick={() => fileInputRef.current?.click()} className="w-full py-10 bg-white border-8 border-dashed border-[#fadb31] text-[#f6a118] rounded-[4rem] text-4xl font-bold">🖼️ Cargar Fotos Galería</button>
             <button onClick={handleSave} className="w-full py-12 matita-gradient-orange text-white rounded-[4rem] text-6xl font-bold shadow-2xl border-8 border-white">¡Guardar Todo! ✨</button>
          </div>
        </div>
      </div>
      <div className="space-y-12 sticky top-10 h-fit">
        <h4 className="text-6xl font-bold text-gray-300 text-center">Vista Previa 📱</h4>
        <div className="bg-[#fef9eb] rounded-[6rem] p-12 border-[16px] border-white shadow-2xl space-y-12">
           <div className="flex gap-6 overflow-x-auto pb-6">
             {editingProduct?.images?.map((img, i) => (
               <div key={i} className="relative w-56 h-56 flex-shrink-0 group">
                 <img src={img} className="w-full h-full object-cover rounded-[3rem] shadow-xl" />
                 <button onClick={() => setEditingProduct({...editingProduct, images: editingProduct.images?.filter((_, idx) => idx !== i)})} className="absolute -top-4 -right-4 bg-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center">×</button>
               </div>
             ))}
           </div>
           <div className="space-y-6">
              <h5 className="text-7xl font-bold text-gray-800">{editingProduct?.name || 'Nombre'}</h5>
              <p className="text-8xl text-[#f6a118] font-bold">${editingProduct?.price || '0'}</p>
              <p className="text-3xl text-gray-400 italic">"{editingProduct?.category || 'General'}"</p>
           </div>
        </div>
      </div>
    </div>
  );
};

const SalesManager: React.FC = () => {
  const { supabase } = useApp();
  const [sales, setSales] = useState<any[]>([]);
  useEffect(() => {
    const fetchSales = async () => {
      const { data } = await supabase.from('sales').select('*').order('created_at', { ascending: false });
      if (data) setSales(data);
    };
    fetchSales();
  }, []);
  return (
    <div className="space-y-12">
      <h3 className="text-6xl font-bold text-gray-800">Ventas Recientes 📊</h3>
      <div className="bg-white rounded-[5rem] overflow-hidden border-8 border-white shadow-2xl">
        <table className="w-full text-left text-4xl">
          <thead className="bg-[#fadb31]/30 text-[#f6a118]">
            <tr><th className="py-12 px-14">Fecha</th><th className="py-12 px-14">Socio</th><th className="py-12 px-14">Total</th></tr>
          </thead>
          <tbody>
            {sales.map(s => (
              <tr key={s.id} className="border-b-4 border-[#fef9eb] hover:bg-[#fef9eb]">
                <td className="py-12 px-14">{new Date(s.created_at).toLocaleDateString()}</td>
                <td className="py-12 px-14 font-bold text-gray-500">{s.user_email}</td>
                <td className="py-12 px-14 text-[#f6a118] font-bold">${s.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SociosManager: React.FC = () => {
  const { supabase } = useApp();
  const [socios, setSocios] = useState<User[]>([]);
  useEffect(() => {
    const fetchSocios = async () => {
      const { data } = await supabase.from('users').select('*').order('points', { ascending: false });
      if (data) setSocios(data.map((u:any) => ({ id: u.id, name: u.name, email: u.email, points: u.points, isAdmin: u.is_admin, isSocio: u.is_socio })));
    };
    fetchSocios();
  }, []);
  return (
    <div className="space-y-12">
      <h3 className="text-6xl font-bold text-gray-800">Mi Club de Socios 👑</h3>
      <div className="grid gap-10">
        {socios.map(s => (
          <div key={s.id} className="bg-white p-12 rounded-[4rem] shadow-xl border-4 border-white flex justify-between items-center group hover:border-[#fadb31]">
             <div className="flex items-center gap-10">
                <div className="text-6xl">👑</div>
                <div><h4 className="text-5xl font-bold text-gray-800">{s.name}</h4><p className="text-3xl text-gray-400">{s.email}</p></div>
             </div>
             <p className="text-7xl font-bold text-[#f6a118]">{s.points} pts ✨</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const IdeasManager: React.FC = () => {
  const { supabase } = useApp();
  const [ideas, setIdeas] = useState<any[]>([]);
  useEffect(() => {
    const fetchIdeas = async () => {
      const { data } = await supabase.from('ideas').select('*').order('created_at', { ascending: false });
      if (data) setIdeas(data);
    };
    fetchIdeas();
  }, []);
  return (
    <div className="space-y-12">
      <h3 className="text-6xl font-bold text-gray-800">Buzón de Ideas 💡</h3>
      <div className="grid gap-12">
        {ideas.map(i => (
          <div key={i.id} className="bg-[#fef9eb] p-16 rounded-[5rem] border-8 border-white shadow-2xl relative group">
             <div className="absolute top-0 right-0 p-12 text-9xl opacity-5 transition-transform group-hover:rotate-12">📬</div>
             <p className="text-5xl font-bold text-gray-800 mb-8 underline decoration-[#fadb31] decoration-8 underline-offset-8">"{i.title}"</p>
             <p className="text-4xl text-gray-500 italic leading-relaxed">"{i.content}"</p>
             <p className="mt-12 text-3xl text-[#f6a118] font-bold">- De: {i.user_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const DesignManager: React.FC = () => {
  const { logoUrl, setLogoUrl, supabase } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader(); reader.onloadend = () => setLogoUrl(reader.result as string); reader.readAsDataURL(file);
  };
  const saveConfig = async () => {
    const { error } = await supabase.from('site_config').upsert({ id: 'global', logo_url: logoUrl });
    if (error) alert(error.message); else alert('✨ Identidad Matita Guardada ✨');
  };
  return (
    <div className="max-w-4xl mx-auto space-y-16 text-center py-10">
      <h3 className="text-8xl font-bold text-[#f6a118]">Identidad 🎨</h3>
      <div className="bg-white p-24 rounded-[7rem] shadow-2xl space-y-16 border-[12px] border-[#fef9eb]">
        <div className="w-96 h-96 bg-[#fef9eb] rounded-full mx-auto shadow-inner flex items-center justify-center p-12 border-8 border-white group relative overflow-hidden transition-all duration-700 hover:rotate-6">
           <img src={logoUrl} className="w-full h-full object-contain" />
           <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <p className="text-white font-bold text-5xl">Cambiar Logo</p>
           </div>
        </div>
        <input type="file" ref={fileInputRef} className="hidden" onChange={handleLogoUpload} accept="image/*" />
        <button onClick={saveConfig} className="w-full py-12 matita-gradient-orange text-white rounded-[4rem] text-6xl font-bold shadow-2xl border-8 border-white">¡Guardar Marca! ✨</button>
      </div>
    </div>
  );
};

export default AdminPanel;

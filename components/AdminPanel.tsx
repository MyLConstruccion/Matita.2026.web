import React, { useState, useRef, useEffect } from 'react';
import { Product, Category, User, Sale, ColorStock } from '../types';
import { useApp } from '../App';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const AdminPanel: React.FC = () => {
  const { supabase } = useApp();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'sales' | 'socios' | 'ideas' | 'design'>('dashboard');

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'matita2026') setIsAuthenticated(true);
    else alert('Contraseña incorrecta ❌');
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto py-20 px-6 animate-fadeIn">
        <div className="bg-white rounded-[3rem] p-16 shadow-2xl border-4 border-[#fadb31] text-center space-y-10">
          <div className="text-9xl mb-4">👑</div>
          <h2 className="text-5xl font-bold text-gray-800">Panel Maestro</h2>
          <form onSubmit={handleAdminAuth} className="space-y-8">
            <input 
              type="password" 
              placeholder="Clave Matita" 
              className="w-full text-3xl text-center shadow-inner py-5 bg-[#fef9eb] rounded-3xl" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <button className="w-full py-6 matita-gradient-orange text-white rounded-[2rem] text-4xl font-bold shadow-lg hover:scale-105 transition-all">
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto space-y-12 py-10 animate-fadeIn px-4">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b-4 border-[#fadb31]/20 pb-8">
        <div>
          <h2 className="text-6xl font-bold text-[#f6a118]">Gestión Matita</h2>
          <p className="text-2xl text-gray-400 italic">Estadísticas y Control ✏️</p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          {[
            { id: 'dashboard', label: '📊 Dashboard' },
            { id: 'inventory', label: '📦 Stock' },
            { id: 'sales', label: '💸 Ventas' },
            { id: 'socios', label: '👥 Socios' },
            { id: 'ideas', label: '💡 Ideas' },
            { id: 'design', label: '🎨 Marca' }
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id as any)} 
              className={`px-8 py-3 rounded-[1.5rem] text-xl font-bold transition-all ${activeTab === tab.id ? 'matita-gradient-orange text-white shadow-lg scale-110' : 'bg-white text-gray-400 hover:text-[#f6a118]'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[4rem] shadow-matita p-8 md:p-14 border-[8px] border-white">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'inventory' && <InventoryManager />}
        {activeTab === 'sales' && <SalesManager />}
        {activeTab === 'socios' && <SociosManager />}
        {activeTab === 'ideas' && <IdeasManager />}
        {activeTab === 'design' && <DesignManager />}
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { supabase } = useApp();
  const [data, setData] = useState<any>({ salesHistory: [], categoryStats: [], totals: { sales: 0, users: 0, products: 0 } });

  useEffect(() => {
    const fetchDashboard = async () => {
      const { data: sales } = await supabase.from('sales').select('*').order('created_at', { ascending: true });
      const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
      const { count: prodCount } = await supabase.from('products').select('*', { count: 'exact', head: true });

      if (sales) {
        const history = sales.map((s:any) => ({ 
          date: new Date(s.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
          amount: s.total 
        }));
        
        const catMap: any = {};
        sales.forEach((s:any) => {
          catMap[s.category_summary || 'Varios'] = (catMap[s.category_summary || 'Varios'] || 0) + s.total;
        });
        const categories = Object.keys(catMap).map(k => ({ name: k, total: catMap[k] }));

        setData({
          salesHistory: history,
          categoryStats: categories,
          totals: {
            sales: sales.reduce((a:number, b:any) => a + b.total, 0),
            users: usersCount || 0,
            products: prodCount || 0
          }
        });
      }
    };
    fetchDashboard();
  }, []);

  const COLORS = ['#f6a118', '#ea7e9c', '#fadb31', '#93c5fd', '#86efac'];

  return (
    <div className="space-y-16 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="bg-[#fef9eb] p-10 rounded-[3rem] text-center border-4 border-white shadow-sm">
          <p className="text-2xl text-gray-400 font-bold uppercase">Total Ventas</p>
          <p className="text-7xl font-bold text-[#f6a118]">${data.totals.sales}</p>
        </div>
        <div className="bg-[#fff1f2] p-10 rounded-[3rem] text-center border-4 border-white shadow-sm">
          <p className="text-2xl text-gray-400 font-bold uppercase">Mis Socios</p>
          <p className="text-7xl font-bold text-[#ea7e9c]">{data.totals.users}</p>
        </div>
        <div className="bg-[#f0f9ff] p-10 rounded-[3rem] text-center border-4 border-white shadow-sm">
          <p className="text-2xl text-gray-400 font-bold uppercase">Productos</p>
          <p className="text-7xl font-bold text-blue-400">{data.totals.products}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-16">
        <div className="space-y-6">
          <h4 className="text-3xl font-bold text-gray-700 ml-4">Tendencia de Ventas 💸</h4>
          <div className="h-[400px] w-full bg-[#fdfaf6] p-6 rounded-[3rem] border-2 border-white shadow-inner">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.salesHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="date" stroke="#999" fontSize={12} />
                <YAxis stroke="#999" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#f6a118" strokeWidth={4} dot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-3xl font-bold text-gray-700 ml-4">Ventas por Categoría 🏷️</h4>
          <div className="h-[400px] w-full bg-[#fdfaf6] p-6 rounded-[3rem] border-2 border-white shadow-inner">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.categoryStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" stroke="#999" fontSize={12} />
                <YAxis stroke="#999" fontSize={12} />
                <Tooltip />
                <Bar dataKey="total">
                  {data.categoryStats.map((entry:any, index:number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const InventoryManager: React.FC = () => {
  const { supabase } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [formMode, setFormMode] = useState<'list' | 'edit'>('list');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data.map((p: any) => ({ 
      ...p, 
      oldPrice: p.old_price, 
      images: p.images || [], 
      colors: p.colors || [] 
    })));
  };

  useEffect(() => { fetchProducts(); }, []);

  const updateStock = (idx: number, change: number) => {
    if (!editingProduct?.colors) return;
    const next = [...editingProduct.colors];
    next[idx].stock = Math.max(0, (next[idx].stock || 0) + change);
    setEditingProduct({ ...editingProduct, colors: next });
  };

  const addColor = () => {
    const next = [...(editingProduct?.colors || []), { color: '', stock: 0 }];
    setEditingProduct({ ...editingProduct, colors: next });
  };

  const removeColor = (idx: number) => {
    const next = editingProduct?.colors?.filter((_, i) => i !== idx);
    setEditingProduct({ ...editingProduct, colors: next });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingProduct(prev => ({
          ...prev!,
          images: [...(prev?.images || []), reader.result as string]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx: number) => {
    setEditingProduct(prev => ({
      ...prev!,
      images: prev?.images?.filter((_, i) => i !== idx)
    }));
  };

  const handleSave = async () => {
    if (!editingProduct?.name) return;
    const p = { 
      ...editingProduct, 
      old_price: editingProduct.oldPrice,
      images: editingProduct.images,
      colors: editingProduct.colors
    };
    if (editingProduct.id) await supabase.from('products').update(p).eq('id', editingProduct.id);
    else await supabase.from('products').insert(p);
    setFormMode('list'); fetchProducts();
  };

  if (formMode === 'list') {
    return (
      <div className="space-y-10">
        <div className="flex justify-between items-center">
          <h3 className="text-4xl font-bold">Inventario Real</h3>
          <button onClick={() => { setEditingProduct({ name: '', price: 0, oldPrice: 0, colors: [{color: 'Único', stock: 10}], images: [] }); setFormMode('edit'); }} className="px-8 py-4 bg-[#f6a118] text-white rounded-2xl font-bold text-2xl shadow-md">+ Nuevo Tesoro</button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(p => (
            <div key={p.id} className="bg-gray-50 p-6 rounded-3xl border-2 border-white shadow-sm hover:border-[#fadb31] transition-all">
              <img src={p.images[0] || 'https://via.placeholder.com/400'} className="w-full aspect-square object-cover rounded-2xl mb-4" />
              <h4 className="text-2xl font-bold truncate">{p.name}</h4>
              <div className="flex items-center gap-3">
                <p className="text-3xl font-bold text-[#f6a118]">${p.price}</p>
                {p.oldPrice > 0 && <p className="text-xl text-gray-400 line-through">${p.oldPrice}</p>}
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => { setEditingProduct(p); setFormMode('edit'); }} className="flex-grow py-3 bg-white text-[#f6a118] rounded-xl font-bold border border-[#fadb31]">Editar</button>
                <button onClick={async () => { if(confirm('¿Borrar?')) { await supabase.from('products').delete().eq('id', p.id); fetchProducts(); } }} className="px-4 text-red-300">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      <button onClick={() => setFormMode('list')} className="text-3xl">🔙 Volver</button>
      <div className="bg-gray-50 p-8 md:p-12 rounded-[3rem] border-4 border-white space-y-10">
        <div className="space-y-4">
          <label className="text-2xl font-bold text-gray-700 ml-2">Galería de Fotos 📸</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {editingProduct?.images?.map((img, i) => (
              <div key={i} className="relative group aspect-square">
                <img src={img} className="w-full h-full object-cover rounded-2xl border-4 border-white shadow-sm" />
                <button onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-red-500 text-white w-8 h-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
              </div>
            ))}
            <button onClick={() => fileInputRef.current?.click()} className="aspect-square border-4 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-[#f6a118] hover:text-[#f6a118] transition-all bg-white">
              <span className="text-5xl">+</span>
              <span className="font-bold">Subir Foto</span>
            </button>
          </div>
          <input type="file" multiple ref={fileInputRef} className="hidden" onChange={handleImageUpload} accept="image/*" />
        </div>
        <div className="space-y-6">
          <input type="text" placeholder="Nombre" className="w-full text-3xl p-6 rounded-2xl border-none shadow-inner" value={editingProduct?.name} onChange={e => setEditingProduct({...editingProduct!, name: e.target.value})} />
          <div className="grid md:grid-cols-3 gap-6">
            <input type="number" placeholder="Precio Actual" className="text-3xl p-5 rounded-2xl border-none shadow-inner" value={editingProduct?.price} onChange={e => setEditingProduct({...editingProduct!, price: parseFloat(e.target.value)})} />
            <input type="number" placeholder="Precio Viejo" className="text-3xl p-5 rounded-2xl border-none shadow-inner text-gray-400" value={editingProduct?.oldPrice} onChange={e => setEditingProduct({...editingProduct!, oldPrice: parseFloat(e.target.value)})} />
            <input type="number" placeholder="Puntos" className="text-3xl p-5 rounded-2xl border-none shadow-inner" value={editingProduct?.points} onChange={e => setEditingProduct({...editingProduct!, points: parseInt(e.target.value)})} />
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex justify-between items-center"><label className="text-2xl font-bold text-gray-700">Colores y Stock 🎨</label><button onClick={addColor} className="text-[#f6a118] font-bold text-xl">+ Agregar Color</button></div>
          <div className="grid gap-4">
             {editingProduct?.colors?.map((c, i) => (
               <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-3xl border-2 border-white shadow-sm">
                  <input className="flex-grow border-none text-2xl" value={c.color} onChange={e => {
                    const n = [...editingProduct.colors!]; n[i].color = e.target.value; setEditingProduct({...editingProduct, colors: n});
                  }} />
                  <div className="flex items-center gap-6 bg-[#fef9eb] px-6 py-2 rounded-2xl">
                    <button onClick={() => updateStock(i, -1)} className="text-4xl text-[#ea7e9c] font-bold">-</button>
                    <span className="text-3xl font-bold min-w-[3rem] text-center">{c.stock}</span>
                    <button onClick={() => updateStock(i, 1)} className="text-4xl text-[#f6a118] font-bold">+</button>
                  </div>
                  <button onClick={() => removeColor(i)} className="text-2xl p-2 opacity-30">🗑️</button>
               </div>
             ))}
          </div>
        </div>
        <button onClick={handleSave} className="w-full py-8 matita-gradient-orange text-white rounded-[2.5rem] text-4xl font-bold shadow-xl">¡Guardar Cambios! ✨</button>
      </div>
    </div>
  );
};

const SalesManager: React.FC = () => {
  const { supabase } = useApp();
  const [sales, setSales] = useState<any[]>([]);
  const fetchSales = async () => {
    const { data } = await supabase.from('sales').select('*').order('created_at', { ascending: false });
    if (data) setSales(data);
  };
  useEffect(() => { fetchSales(); }, []);

  const deleteSale = async (id: string) => {
    if (confirm('¿Borrar registro de venta?')) {
      await supabase.from('sales').delete().eq('id', id);
      fetchSales();
    }
  };

  return (
    <div className="space-y-8">
      <h3 className="text-4xl font-bold">Historial de Ventas 💸</h3>
      <div className="grid gap-6">
        {sales.map(s => (
          <div key={s.id} className="bg-gray-50 p-8 rounded-3xl border-2 border-white flex justify-between items-center group">
            <div>
              <p className="text-2xl font-bold text-gray-800">{s.user_name || 'Invitado'}</p>
              <p className="text-xl text-gray-400">{new Date(s.created_at).toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-8">
              <p className="text-4xl font-bold text-[#f6a118]">${s.total}</p>
              <button onClick={() => deleteSale(s.id)} className="opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-500 transition-all">Borrar 🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SociosManager: React.FC = () => {
  const { supabase } = useApp();
  const [socios, setSocios] = useState<User[]>([]);
  const fetchSocios = async () => {
    const { data } = await supabase.from('users').select('*').order('points', { ascending: false });
    if (data) setSocios(data.map((u:any) => ({ ...u, isSocio: u.is_socio, isAdmin: u.is_admin })));
  };
  useEffect(() => { fetchSocios(); }, []);

  const deleteSocio = async (id: string) => {
    if (confirm('¿ELIMINAR SOCIO? Se borrará su cuenta y puntos.')) {
      await supabase.from('users').delete().eq('id', id);
      fetchSocios();
    }
  };

  return (
    <div className="space-y-8">
      <h3 className="text-4xl font-bold">Miembros del Club 👑</h3>
      <div className="grid gap-6">
        {socios.map(s => (
          <div key={s.id} className="bg-white p-10 rounded-[3rem] border-4 border-white shadow-sm flex justify-between items-center group">
             <div className="flex items-center gap-8">
                <div className="w-16 h-16 bg-[#fef9eb] rounded-full flex items-center justify-center text-4xl">👑</div>
                <div><h4 className="text-3xl font-bold">{s.name}</h4><p className="text-xl text-gray-400">{s.email}</p></div>
             </div>
             <div className="flex items-center gap-10">
                <p className="text-5xl font-bold text-[#f6a118]">{s.points} pts</p>
                <button onClick={() => deleteSocio(s.id)} className="opacity-0 group-hover:opacity-100 p-3 bg-red-50 text-red-400 rounded-full hover:bg-red-500 hover:text-white">🗑️</button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const IdeasManager: React.FC = () => {
  const { supabase } = useApp();
  const [ideas, setIdeas] = useState<any[]>([]);
  const fetchIdeas = async () => {
    const { data } = await supabase.from('ideas').select('*').order('created_at', { ascending: false });
    if (data) setIdeas(data);
  };
  useEffect(() => { fetchIdeas(); }, []);

  const deleteIdea = async (id: string) => {
    if (confirm('¿Borrar esta idea?')) {
      await supabase.from('ideas').delete().eq('id', id);
      fetchIdeas();
    }
  };

  return (
    <div className="space-y-8">
      <h3 className="text-4xl font-bold">Buzón 💡</h3>
      <div className="grid gap-8">
        {ideas.map(i => (
          <div key={i.id} className="bg-[#fef9eb] p-10 rounded-[3rem] border-4 border-white shadow-sm relative group">
             <button onClick={() => deleteIdea(i.id)} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-red-300">Borrar Idea</button>
             <p className="text-3xl font-bold underline decoration-[#fadb31] decoration-4 mb-4">"{i.title}"</p>
             <p className="text-2xl text-gray-500 italic">"{i.content}"</p>
             <p className="mt-6 text-xl text-[#f6a118] font-bold">- De: {i.user_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const DesignManager: React.FC = () => {
  const { logoUrl, setLogoUrl, supabase } = useApp();
  const fRef = useRef<HTMLInputElement>(null);
  const s = async () => {
    await supabase.from('site_config').upsert({ id: 'global', logo_url: logoUrl });
    alert('✨ Identidad Actualizada ✨');
  };
  return (
    <div className="text-center py-10 space-y-10">
      <div className="w-64 h-64 bg-[#fef9eb] rounded-full mx-auto flex items-center justify-center p-8 border-8 border-white shadow-inner cursor-pointer" onClick={() => fRef.current?.click()}>
        <img src={logoUrl} className="w-full h-full object-contain" />
      </div>
      <input type="file" ref={fRef} className="hidden" onChange={e => {
        const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onloadend = () => setLogoUrl(r.result as string); r.readAsDataURL(f); }
      }} />
      <button onClick={s} className="px-16 py-5 matita-gradient-orange text-white rounded-3xl text-3xl font-bold shadow-xl">Guardar Identidad</button>
    </div>
  );
};

export default AdminPanel;


import React, { useState, useRef, useEffect } from 'react';
import { Product, Category, User, Sale, ColorStock } from '../types';
import { useApp } from '../App';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

// Helper para construir la URL de Cloudinary (Lógica de optimización q_auto, f_auto)
const getImgUrl = (id: string, w = 600) => {
  if (!id) return "";
  if (id.startsWith('data:') || id.startsWith('http')) return id;
  return `https://res.cloudinary.com/dllm8ggob/image/upload/q_auto,f_auto,w_${w}/${id}`;
};

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
              className="w-full text-3xl text-center shadow-inner py-5 bg-[#fef9eb] rounded-3xl outline-none" 
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
          <p className="text-2xl text-gray-400 italic">Estadísticas y Control Real ✏️</p>
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

      <div className="bg-white rounded-[4rem] shadow-matita p-8 md:p-14 border-[8px] border-white min-h-[600px]">
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

// --- COMPONENTE DASHBOARD ---
const Dashboard: React.FC = () => {
  const { supabase } = useApp();
  const [data, setData] = useState<any>({ 
    salesHistory: [], 
    categoryStats: [], 
    totals: { sales: 0, users: 0, products: 0 } 
  });

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
          const cat = s.category_summary || 'Varios';
          catMap[cat] = (catMap[cat] || 0) + s.total;
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
  }, [supabase]);

  const COLORS = ['#f6a118', '#ea7e9c', '#fadb31', '#93c5fd', '#86efac'];

  return (
    <div className="space-y-16 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="bg-[#fef9eb] p-10 rounded-[3rem] text-center border-4 border-white shadow-sm">
          <p className="text-2xl text-gray-400 font-bold uppercase">Total Ventas</p>
          <p className="text-7xl font-bold text-[#f6a118]">${data.totals.sales}</p>
        </div>
        <div className="bg-[#fff1f2] p-10 rounded-[3rem] text-center border-4 border-white shadow-sm">
          <p className="text-2xl text-gray-400 font-bold uppercase">Socios Registrados</p>
          <p className="text-7xl font-bold text-[#ea7e9c]">{data.totals.users}</p>
        </div>
        <div className="bg-[#f0f9ff] p-10 rounded-[3rem] text-center border-4 border-white shadow-sm">
          <p className="text-2xl text-gray-400 font-bold uppercase">Artículos en Stock</p>
          <p className="text-7xl font-bold text-blue-400">{data.totals.products}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-16">
        <div className="space-y-6">
          <h4 className="text-3xl font-bold text-gray-700 ml-4">Tendencia de Dinero 💸</h4>
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

// --- COMPONENTE INVENTORY MANAGER (CON FIX DE NÚMEROS Y CLOUDINARY) ---
const InventoryManager: React.FC = () => {
  const { supabase } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [formMode, setFormMode] = useState<'list' | 'edit'>('list');
  const [isUploading, setIsUploading] = useState(false);
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

  useEffect(() => { fetchProducts(); }, [supabase]);

  const updateStock = (idx: number, change: number) => {
    if (!editingProduct?.colors) return;
    const next = [...editingProduct.colors];
    const currentStock = Number(next[idx].stock) || 0;
    next[idx].stock = Math.max(0, currentStock + change);
    setEditingProduct({ ...editingProduct, colors: next });
  };

  const handleSave = async () => {
    if (!editingProduct?.name) return alert('¡Escribe el nombre del tesoro!');
    
    // Forzamos conversión a Number para evitar problemas de base de datos
    const p = { 
      name: editingProduct.name,
      description: editingProduct.description || "",
      price: Number(editingProduct.price) || 0,
      old_price: Number(editingProduct.oldPrice) || 0,
      points: Number(editingProduct.points) || 0,
      category: editingProduct.category || "Escolar",
      images: editingProduct.images || [],
      colors: editingProduct.colors || []
    };

    if (editingProduct.id) {
      await supabase.from('products').update(p).eq('id', editingProduct.id);
    } else {
      await supabase.from('products').insert(p);
    }
    
    alert('✨ ¡Stock actualizado! ✨');
    setFormMode('list'); 
    fetchProducts();
  };

  const uploadImageToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Matita_web"); 
    formData.append("folder", "matita2026");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dllm8ggob/image/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      return data.secure_url; // Guardamos la URL optimizada directamente
    } catch (error) {
      console.error("Cloudinary error:", error);
      return null;
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newImages = [...(editingProduct?.images || [])];
    
    for (let i = 0; i < files.length; i++) {
      const url = await uploadImageToCloudinary(files[i]);
      if (url) newImages.push(url);
    }
    
    setEditingProduct(prev => ({ ...prev!, images: newImages }));
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (formMode === 'list') {
    return (
      <div className="space-y-10">
        <div className="flex justify-between items-center">
          <h3 className="text-4xl font-bold text-gray-700">Inventario Real 📦</h3>
          <button 
            onClick={() => { 
              setEditingProduct({ name: '', price: 0, oldPrice: 0, points: 0, category: 'Escolar', colors: [{color: 'Único', stock: 10}], images: [] }); 
              setFormMode('edit'); 
            }} 
            className="px-8 py-4 bg-[#f6a118] text-white rounded-2xl font-bold text-2xl shadow-md hover:scale-105 transition-all"
          >
            + Cargar Producto
          </button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(p => (
            <div key={p.id} className="bg-gray-50 p-6 rounded-[2.5rem] border-2 border-white shadow-sm hover:border-[#fadb31] transition-all flex flex-col">
              <img src={getImgUrl(p.images[0])} className="w-full aspect-square object-cover rounded-3xl mb-4 border-4 border-white shadow-inner" />
              <h4 className="text-2xl font-bold truncate text-gray-800">{p.name}</h4>
              <p className="text-3xl font-bold text-[#f6a118] mb-4">${p.price}</p>
              <div className="flex gap-2 mt-auto">
                <button onClick={() => { setEditingProduct(p); setFormMode('edit'); }} className="flex-grow py-3 bg-white text-[#f6a118] rounded-xl font-bold border border-[#fadb31] hover:bg-[#fadb31] hover:text-white transition-all">Editar ✏️</button>
                <button onClick={async () => { if(confirm('¿Borrar este tesoro?')) { await supabase.from('products').delete().eq('id', p.id); fetchProducts(); } }} className="px-4 text-red-300 hover:text-red-500">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      <div className="flex items-center gap-6">
        <button onClick={() => setFormMode('list')} className="text-5xl hover:scale-110 transition-all">🔙</button>
        <h3 className="text-4xl font-bold text-gray-800">Cargar / Editar Tesoro</h3>
      </div>
      
      <div className="bg-gray-50 p-10 rounded-[4rem] border-4 border-white space-y-10 shadow-xl">
        <div className="grid md:grid-cols-2 gap-8">
           <div className="space-y-2">
             <label className="text-xl font-bold text-gray-400 ml-4">Nombre</label>
             <input type="text" className="w-full text-3xl p-5 rounded-2xl outline-none shadow-inner" value={editingProduct?.name} onChange={e => setEditingProduct({...editingProduct!, name: e.target.value})} />
           </div>
           <div className="space-y-2">
             <label className="text-xl font-bold text-gray-400 ml-4">Categoría</label>
             <select className="w-full text-3xl p-5 rounded-2xl outline-none shadow-inner" value={editingProduct?.category} onChange={e => setEditingProduct({...editingProduct!, category: e.target.value as any})}>
               {['Escolar', 'Regalaría', 'Oficina', 'Tecnología', 'Novedades', 'Ofertas'].map(c => <option key={c} value={c}>{c}</option>)}
             </select>
           </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-2">
             <label className="text-xl font-bold text-gray-400 ml-4">Precio ($)</label>
             <input type="number" className="w-full text-3xl p-5 rounded-2xl outline-none shadow-inner" value={editingProduct?.price || ''} onChange={e => setEditingProduct({...editingProduct!, price: Number(e.target.value)})} />
          </div>
          <div className="space-y-2">
             <label className="text-xl font-bold text-gray-400 ml-4">Precio Antes ($)</label>
             <input type="number" className="w-full text-3xl p-5 rounded-2xl outline-none shadow-inner" value={editingProduct?.oldPrice || ''} onChange={e => setEditingProduct({...editingProduct!, oldPrice: Number(e.target.value)})} />
          </div>
          <div className="space-y-2">
             <label className="text-xl font-bold text-gray-400 ml-4">Puntos ✨</label>
             <input type="number" className="w-full text-3xl p-5 rounded-2xl outline-none shadow-inner" value={editingProduct?.points || ''} onChange={e => setEditingProduct({...editingProduct!, points: Number(e.target.value)})} />
          </div>
        </div>

        <div className="space-y-6">
           <div className="flex justify-between items-center px-4">
             <h4 className="text-2xl font-bold text-gray-500">Colores y Cantidades</h4>
             <button onClick={() => setEditingProduct({...editingProduct!, colors: [...(editingProduct?.colors || []), {color: 'Nuevo', stock: 1}]})} className="text-[#f6a118] font-bold text-xl">+ Añadir Variante</button>
           </div>
           <div className="grid gap-4">
             {editingProduct?.colors?.map((c, i) => (
               <div key={i} className="flex flex-wrap items-center gap-6 bg-white p-6 rounded-[2rem] border-2 border-white shadow-sm">
                  <input className="flex-grow border-none text-2xl font-bold p-0 bg-transparent outline-none" value={c.color} onChange={e => {
                    const n = [...editingProduct.colors!]; n[i].color = e.target.value; setEditingProduct({...editingProduct, colors: n});
                  }} />
                  <div className="flex items-center gap-6 bg-gray-50 px-6 py-2 rounded-full border border-gray-100">
                    <button onClick={() => updateStock(i, -1)} className="text-5xl text-[#ea7e9c] font-bold hover:scale-125 transition-all">-</button>
                    <span className="text-3xl font-bold min-w-[3rem] text-center">{c.stock}</span>
                    <button onClick={() => updateStock(i, 1)} className="text-5xl text-[#f6a118] font-bold hover:scale-125 transition-all">+</button>
                  </div>
                  <button onClick={() => setEditingProduct({...editingProduct, colors: editingProduct.colors?.filter((_, idx) => idx !== i)})} className="text-red-200 hover:text-red-500">🗑️</button>
               </div>
             ))}
           </div>
        </div>

        <div className="space-y-6">
           <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} multiple accept="image/*" />
           <button 
             onClick={() => fileInputRef.current?.click()} 
             disabled={isUploading}
             className="w-full py-10 bg-white border-4 border-dashed border-gray-200 text-gray-400 rounded-[3rem] text-2xl font-bold hover:bg-gray-100 transition-all disabled:opacity-50"
           >
             {isUploading ? '📤 Subiendo al servidor...' : '📸 Abrir Galería del Celular'}
           </button>
           
           <div className="flex gap-4 overflow-x-auto py-4 scrollbar-hide">
              {editingProduct?.images?.map((img, idx) => (
                <div key={idx} className="w-32 h-32 relative flex-shrink-0 group">
                   <img src={getImgUrl(img, 150)} className="w-full h-full object-cover rounded-2xl shadow-md border-2 border-white" />
                   <button onClick={() => setEditingProduct({...editingProduct, images: editingProduct.images?.filter((_, i) => i !== idx)})} className="absolute top-1 right-1 bg-white/80 rounded-full w-8 h-8 flex items-center justify-center text-xs shadow-lg font-bold">×</button>
                </div>
              ))}
           </div>
        </div>

        <button onClick={handleSave} className="w-full py-8 matita-gradient-orange text-white rounded-[3rem] text-5xl font-bold shadow-2xl border-4 border-white hover:scale-[1.02] active:scale-95 transition-all">
          ¡Guardar Cambios! ✨
        </button>
      </div>
    </div>
  );
};

// --- COMPONENTE SALES MANAGER ---
const SalesManager: React.FC = () => {
  const { supabase } = useApp();
  const [sales, setSales] = useState<any[]>([]);
  const fetchSales = async () => {
    const { data } = await supabase.from('sales').select('*').order('created_at', { ascending: false });
    if (data) setSales(data);
  };
  useEffect(() => { fetchSales(); }, [supabase]);

  const deleteSale = async (id: string) => {
    if (confirm('¿ELIMINAR ESTE REGISTRO DE VENTA?')) {
      await supabase.from('sales').delete().eq('id', id);
      fetchSales();
    }
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      <h3 className="text-4xl font-bold text-gray-700">Historial de Tickets 💸</h3>
      <div className="grid gap-6">
        {sales.map(s => (
          <div key={s.id} className="bg-gray-50 p-10 rounded-[3rem] border-2 border-white shadow-sm flex justify-between items-center group relative overflow-hidden">
            <div>
              <p className="text-3xl font-bold text-gray-800">{s.user_name || 'Invitado'}</p>
              <p className="text-xl text-gray-400 italic">{s.user_email || '-'}</p>
              <p className="text-lg text-gray-300 mt-2">{new Date(s.created_at).toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-10">
              <div className="text-right">
                <p className="text-5xl font-bold text-[#f6a118] leading-none">${s.total}</p>
                <p className="text-lg text-gray-400 mt-1 uppercase tracking-widest font-bold">{s.category_summary || 'Venta'}</p>
              </div>
              <button onClick={() => deleteSale(s.id)} className="opacity-0 group-hover:opacity-100 p-4 bg-red-50 text-red-300 rounded-full hover:bg-red-500 hover:text-white transition-all">🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- COMPONENTE SOCIOS MANAGER ---
const SociosManager: React.FC = () => {
  const { supabase } = useApp();
  const [socios, setSocios] = useState<User[]>([]);
  const fetchSocios = async () => {
    const { data } = await supabase.from('users').select('*').order('points', { ascending: false });
    if (data) setSocios(data.map((u:any) => ({ ...u, isSocio: u.is_socio, isAdmin: u.is_admin })));
  };
  useEffect(() => { fetchSocios(); }, [supabase]);

  const deleteSocio = async (id: string) => {
    if (confirm('¿BORRAR SOCIO TOTALMENTE?')) {
      await supabase.from('users').delete().eq('id', id);
      fetchSocios();
    }
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      <h3 className="text-4xl font-bold text-gray-700">Miembros del Club 👑</h3>
      <div className="grid gap-6">
        {socios.map(s => (
          <div key={s.id} className="bg-white p-10 rounded-[3rem] border-4 border-white shadow-sm flex justify-between items-center group">
             <div className="flex items-center gap-8">
                <div className="w-20 h-20 bg-[#fef9eb] rounded-full flex items-center justify-center text-5xl shadow-inner border-2 border-white">👑</div>
                <div>
                   <h4 className="text-3xl font-bold text-gray-800">{s.name}</h4>
                   <p className="text-xl text-gray-400">{s.email}</p>
                   {s.isAdmin && <span className="bg-[#f6a118] text-white px-3 py-0.5 rounded-full text-sm font-bold uppercase mt-1 inline-block">Admin</span>}
                </div>
             </div>
             <div className="flex items-center gap-10">
                <div className="text-right">
                   <p className="text-6xl font-bold text-[#f6a118] leading-none">{s.points}</p>
                   <p className="text-sm text-gray-300 font-bold uppercase tracking-widest">PUNTOS ✨</p>
                </div>
                <button onClick={() => deleteSocio(s.id)} className="opacity-0 group-hover:opacity-100 p-4 text-red-200 hover:text-red-500 transition-all">🗑️</button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- COMPONENTE IDEAS MANAGER ---
const IdeasManager: React.FC = () => {
  const { supabase } = useApp();
  const [ideas, setIdeas] = useState<any[]>([]);
  const fetchIdeas = async () => {
    const { data } = await supabase.from('ideas').select('*').order('created_at', { ascending: false });
    if (data) setIdeas(data);
  };
  useEffect(() => { fetchIdeas(); }, [supabase]);

  const deleteIdea = async (id: string) => {
    if (confirm('¿Borrar esta sugerencia?')) {
      await supabase.from('ideas').delete().eq('id', id);
      fetchIdeas();
    }
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      <h3 className="text-4xl font-bold text-gray-700">Buzón de Ideas 💡</h3>
      <div className="grid gap-8">
        {ideas.map(i => (
          <div key={i.id} className="bg-[#fef9eb] p-12 rounded-[4rem] border-8 border-white shadow-2xl relative group overflow-hidden">
             <div className="absolute top-0 right-0 p-12 text-[12rem] opacity-5">📬</div>
             <button onClick={() => deleteIdea(i.id)} className="absolute top-6 right-8 opacity-0 group-hover:opacity-100 text-red-300 font-bold hover:underline transition-all">Borrar 🗑️</button>
             <p className="text-3xl font-bold text-gray-800 mb-6 underline decoration-[#fadb31] decoration-8 underline-offset-8 italic">"{i.title}"</p>
             <p className="text-2xl text-gray-500 italic leading-relaxed">"{i.content}"</p>
             <div className="mt-10 flex justify-between items-center">
                <p className="text-xl text-[#f6a118] font-bold">- Enviado por: {i.user_name}</p>
                <p className="text-sm text-gray-300">{new Date(i.created_at).toLocaleDateString()}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- COMPONENTE DESIGN MANAGER ---
const DesignManager: React.FC = () => {
  const { logoUrl, setLogoUrl, supabase } = useApp();
  const fRef = useRef<HTMLInputElement>(null);
  
  const saveDesign = async () => {
    const { error } = await supabase.from('site_config').upsert({ id: 'global', logo_url: logoUrl });
    if (error) alert(error.message); else alert('✨ ¡Imagen de Marca Actualizada! ✨');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-16 text-center py-10 animate-fadeIn">
      <h3 className="text-7xl font-bold text-[#f6a118] drop-shadow-md">Identidad Matita 🎨</h3>
      <div className="bg-white p-24 rounded-[7rem] shadow-2xl space-y-16 border-[16px] border-[#fef9eb]">
        <div className="w-80 h-80 bg-[#fef9eb] rounded-full mx-auto shadow-inner flex items-center justify-center p-12 border-8 border-white group relative overflow-hidden">
           <img src={getImgUrl(logoUrl)} className="w-full h-full object-contain" alt="Logo" />
           <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity" onClick={() => fRef.current?.click()}>
              <p className="text-white font-bold text-4xl">Cambiar</p>
           </div>
        </div>
        <input type="file" ref={fRef} className="hidden" onChange={e => {
          const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onloadend = () => setLogoUrl(r.result as string); r.readAsDataURL(f); }
        }} />
        <div className="space-y-10">
           <p className="text-2xl text-gray-400 italic">"Este logo aparecerá en el inicio y en el carrito." 🌸</p>
           <button onClick={saveDesign} className="w-full py-8 matita-gradient-orange text-white rounded-[3rem] text-5xl font-bold shadow-2xl border-4 border-white hover:scale-105 active:scale-95 transition-all">
              Guardar Identidad
           </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

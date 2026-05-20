import { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ShoeCard from '../components/ShoeCard';
import { useAuth } from '../context/AuthContext';

const cats = ['All', 'Sneaker', 'Formal', 'Boot', 'Sandal', 'Other'];
export default function Inventory() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [shoes, setShoes] = useState([]); const [q, setQ] = useState(''); const [cat, setCat] = useState('All');
  const load = async () => setShoes((await api.get('/shoes')).data);
  useEffect(() => { load(); }, []);
  const filtered = useMemo(() => shoes.filter(s => (cat === 'All' || s.category === cat) && `${s.name} ${s.brand}`.toLowerCase().includes(q.toLowerCase())), [shoes, q, cat]);
  const remove = async (shoe) => { if (confirm(`Delete ${shoe.name}?`)) { await api.delete(`/shoes/${shoe._id}`); load(); } };
  return <main className="safe-bottom mx-auto max-w-6xl p-4">
    <div className="mb-4 flex items-center justify-between gap-3"><div><h1 className="text-3xl font-black">Inventory</h1><p className="text-gray-500">Manage shoe models and sizes</p></div></div>
    <input className="input" placeholder="Search by name or brand" value={q} onChange={(e)=>setQ(e.target.value)} />
    <div className="my-4 flex gap-2 overflow-x-auto pb-1">{cats.map(c => <button key={c} onClick={()=>setCat(c)} className={`rounded-full px-4 py-2 text-sm font-semibold ${cat===c?'bg-indigo-600 text-white':'bg-white text-gray-600 border border-gray-200'}`}>{c}</button>)}</div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{filtered.map(shoe => <ShoeCard key={shoe._id} shoe={shoe} isAdmin={isAdmin} onEdit={(s)=>navigate(`/inventory/edit/${s._id}`)} onDelete={remove}/>)}</div>
    {!filtered.length && <p className="card mt-6 text-center text-gray-500">No shoes found.</p>}
    {isAdmin && <button onClick={()=>navigate('/inventory/add')} className="btn-primary fixed bottom-24 right-5 z-20 h-14 w-14 rounded-full p-0 shadow-soft"><Plus /></button>}
  </main>;
}

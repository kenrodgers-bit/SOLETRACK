import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

const empty = { name: '', brand: '', category: 'Sneaker', buyingPrice: '', sellingPrice: '', lowStockThreshold: 3, sizes: [{ label: '', quantity: 0 }] };
export default function AddEditShoe() {
  const { id } = useParams(); const editing = Boolean(id); const navigate = useNavigate();
  const [form, setForm] = useState(empty); const [image, setImage] = useState(null); const [preview, setPreview] = useState(''); const [error,setError]=useState('');
  useEffect(() => { if (editing) api.get(`/shoes/${id}`).then(({data}) => { setForm(data); setPreview(data.imageUrl || ''); }); }, [editing, id]);
  const set = (k,v)=>setForm(f=>({...f,[k]:v}));
  const setSize = (i,k,v)=>setForm(f=>({...f, sizes:f.sizes.map((s,idx)=>idx===i?{...s,[k]:v}:s)}));
  const submit = async e => { e.preventDefault(); setError(''); try { const payload={...form, buyingPrice:Number(form.buyingPrice), sellingPrice:Number(form.sellingPrice), lowStockThreshold:Number(form.lowStockThreshold), sizes:form.sizes.map(s=>({...s, quantity:Number(s.quantity)}))}; const res = editing ? await api.put(`/shoes/${id}`, payload) : await api.post('/shoes', payload); if (image) { const fd=new FormData(); fd.append('image', image); await api.post(`/shoes/${res.data._id}/upload`, fd, { headers:{'Content-Type':'multipart/form-data'} }); } navigate('/inventory'); } catch(err){ setError(err.response?.data?.message || 'Save failed.'); } };
  return <main className="safe-bottom mx-auto max-w-2xl p-4"><h1 className="mb-4 text-3xl font-black">{editing?'Edit Shoe':'Add Shoe'}</h1><form onSubmit={submit} className="card space-y-4">{error&&<p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <input className="input" placeholder="Shoe name" value={form.name} onChange={e=>set('name',e.target.value)} required />
    <input className="input" placeholder="Brand" value={form.brand} onChange={e=>set('brand',e.target.value)} required />
    <select className="input" value={form.category} onChange={e=>set('category',e.target.value)}>{['Sneaker','Formal','Boot','Sandal','Other'].map(c=><option key={c}>{c}</option>)}</select>
    <div className="grid gap-3 sm:grid-cols-2"><input className="input" type="number" placeholder="Buying price" value={form.buyingPrice} onChange={e=>set('buyingPrice',e.target.value)} required/><input className="input" type="number" placeholder="Selling price" value={form.sellingPrice} onChange={e=>set('sellingPrice',e.target.value)} required/></div>
    <input className="input" type="number" placeholder="Low stock threshold" value={form.lowStockThreshold} onChange={e=>set('lowStockThreshold',e.target.value)} />
    <input className="input" placeholder="Image URL (optional)" value={form.imageUrl || ''} onChange={e=>{ set('imageUrl',e.target.value); setPreview(e.target.value); }} />
    <div><p className="mb-2 font-bold">Sizes</p>{form.sizes.map((s,i)=><div key={i} className="mb-2 grid grid-cols-2 gap-2"><input className="input" placeholder="Size e.g. 42" value={s.label} onChange={e=>setSize(i,'label',e.target.value)} /><input className="input" type="number" placeholder="Quantity" value={s.quantity} onChange={e=>setSize(i,'quantity',e.target.value)} /></div>)}<button type="button" className="btn-soft w-full" onClick={()=>set('sizes',[...form.sizes,{label:'',quantity:0}])}>+ Add Size</button></div>
    <label className="block rounded-2xl border border-dashed border-gray-300 p-4 text-center"><input type="file" accept="image/*" className="hidden" onChange={e=>{ const f=e.target.files[0]; setImage(f); if(f) setPreview(URL.createObjectURL(f)); }} />{preview?<img src={preview} className="mx-auto h-40 rounded-xl object-cover"/>:<span className="text-gray-500">Tap to choose image</span>}</label>
    <button className="btn-primary w-full">Save Shoe</button>
  </form></main>;
}

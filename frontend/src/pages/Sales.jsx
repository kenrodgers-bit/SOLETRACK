import { useEffect, useState } from 'react';
import api from '../api/axios';
import SaleForm from '../components/SaleForm';

export default function Sales() {
  const [shoes,setShoes]=useState([]); const [sales,setSales]=useState([]); const [from,setFrom]=useState(''); const [to,setTo]=useState('');
  const load = async () => { const [shoeRes, saleRes] = await Promise.all([api.get('/shoes'), api.get('/sales', { params:{from,to} })]); setShoes(shoeRes.data); setSales(saleRes.data); };
  useEffect(()=>{ load(); }, []);
  return <main className="safe-bottom mx-auto max-w-5xl p-4"><h1 className="text-3xl font-black">Sales</h1><p className="mb-4 text-gray-500">Record sales and view history</p><div className="grid gap-4 lg:grid-cols-[380px_1fr]"><SaleForm shoes={shoes} onDone={load}/><section className="card"><div className="mb-3 flex flex-col gap-2 sm:flex-row"><input className="input" type="date" value={from} onChange={e=>setFrom(e.target.value)}/><input className="input" type="date" value={to} onChange={e=>setTo(e.target.value)}/><button className="btn-soft" onClick={load}>Filter</button></div><h2 className="text-lg font-bold">Sales History</h2><div className="mt-3 space-y-3">{sales.map(s=><div key={s._id} className="rounded-xl bg-gray-50 p-3"><div className="flex justify-between gap-3"><p className="font-bold">{s.shoeName}</p><p className="font-bold text-indigo-600">KES {Number(s.totalAmount).toLocaleString()}</p></div><p className="text-sm text-gray-500">{new Date(s.date).toLocaleString()} · Size {s.size} · Qty {s.qtySold} · {s.soldByName}</p></div>)}{!sales.length && <p className="rounded-xl bg-gray-50 p-4 text-center text-gray-500">No sales found.</p>}</div></section></div></main>;
}

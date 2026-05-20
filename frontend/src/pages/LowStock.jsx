import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import api from '../api/axios';

export default function LowStock() {
  const [shoes, setShoes] = useState([]);
  useEffect(()=>{ api.get('/shoes').then(r=>setShoes(r.data)); },[]);
  const lows = useMemo(()=>shoes.flatMap(shoe => (shoe.sizes||[]).filter(s=>s.quantity<=shoe.lowStockThreshold).map(s=>({shoe, size:s}))).sort((a,b)=>a.size.quantity-b.size.quantity),[shoes]);
  return <main className="safe-bottom mx-auto max-w-3xl p-4"><h1 className="text-3xl font-black">Low Stock Alerts</h1><p className="mb-4 text-gray-500">Sizes at or below threshold</p>
    <div className="space-y-3">{lows.map(({shoe,size})=><div key={`${shoe._id}-${size.label}`} className="card flex items-center gap-3"><img src={shoe.imageUrl || '/icons/icon-192.png'} className="h-16 w-16 rounded-xl object-cover"/><div className="flex-1"><p className="font-bold">{shoe.name}</p><p className="text-sm text-gray-500">{shoe.brand} · Size {size.label}</p></div><div className="rounded-xl bg-red-50 px-3 py-2 text-center"><p className="text-xs text-red-500">Left</p><p className="font-black text-red-700">{size.quantity}</p></div></div>)}</div>
    {!lows.length && <div className="card mt-6 text-center"><CheckCircle2 className="mx-auto text-green-600" size={44}/><p className="mt-3 font-bold">All stock levels are healthy</p></div>}
  </main>;
}

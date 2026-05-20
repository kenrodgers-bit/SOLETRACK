import { useMemo, useState } from 'react';
import api from '../api/axios';

export default function SaleForm({ shoes, onDone }) {
  const [shoeId, setShoeId] = useState('');
  const [size, setSize] = useState('');
  const [qtySold, setQtySold] = useState(1);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const shoe = shoes.find(s => s._id === shoeId);
  const sizes = shoe?.sizes || [];
  const selectedSize = sizes.find(s => s.label === size);
  const total = useMemo(() => (Number(qtySold || 0) * Number(shoe?.sellingPrice || 0)), [qtySold, shoe]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api.post('/sales', { shoeId, size, qtySold: Number(qtySold) });
      setShoeId(''); setSize(''); setQtySold(1);
      onDone?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not record sale.');
    } finally { setSaving(false); }
  };

  return <form onSubmit={submit} className="card space-y-3">
    <h2 className="text-lg font-bold">Record Sale</h2>
    {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <select className="input" value={shoeId} onChange={(e) => { setShoeId(e.target.value); setSize(''); }} required>
      <option value="">Choose shoe</option>
      {shoes.map(s => <option key={s._id} value={s._id}>{s.name} — {s.brand}</option>)}
    </select>
    <select className="input" value={size} onChange={(e) => setSize(e.target.value)} required disabled={!shoe}>
      <option value="">Choose size</option>
      {sizes.map(s => <option key={s.label} value={s.label}>{s.label} — {s.quantity} in stock</option>)}
    </select>
    <input className="input" type="number" min="1" max={selectedSize?.quantity || undefined} value={qtySold} onChange={(e) => setQtySold(e.target.value)} required />
    <div className="rounded-xl bg-gray-50 p-3">
      <p className="text-sm text-gray-500">Unit price</p>
      <p className="font-bold">KES {Number(shoe?.sellingPrice || 0).toLocaleString()}</p>
      <p className="mt-2 text-sm text-gray-500">Total</p>
      <p className="text-xl font-extrabold text-indigo-600">KES {total.toLocaleString()}</p>
    </div>
    <button className="btn-primary w-full" disabled={saving}>{saving ? 'Saving...' : 'Record Sale'}</button>
  </form>;
}

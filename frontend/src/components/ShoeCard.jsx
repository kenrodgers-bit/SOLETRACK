import { Edit3, Trash2 } from 'lucide-react';
import AlertBadge from './AlertBadge';

const placeholder = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="%23eef2ff"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%234f46e5" font-size="38" font-family="Arial">SoleTrack</text></svg>';

export default function ShoeCard({ shoe, isAdmin, onEdit, onDelete }) {
  const low = shoe.sizes?.some(s => Number(s.quantity) <= Number(shoe.lowStockThreshold));
  return (
    <div className="card overflow-hidden p-0">
      <img src={shoe.imageUrl || placeholder} alt={shoe.name} className="h-40 w-full object-cover" />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-gray-950">{shoe.name}</h3>
            <p className="text-sm text-gray-500">{shoe.brand} · {shoe.category || 'Other'}</p>
          </div>
          <AlertBadge show={low} />
        </div>
        <p className="mt-3 text-lg font-extrabold text-indigo-600">KES {Number(shoe.sellingPrice || 0).toLocaleString()}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {shoe.sizes?.map((s) => (
            <span key={s.label} className={`rounded-full px-2.5 py-1 text-xs font-semibold ${s.quantity <= shoe.lowStockThreshold ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{s.label}: {s.quantity}</span>
          ))}
        </div>
        {isAdmin && <div className="mt-4 flex gap-2">
          <button onClick={() => onEdit(shoe)} className="btn-soft flex-1"><Edit3 size={16} /> Edit</button>
          <button onClick={() => onDelete(shoe)} className="btn flex-1 bg-red-50 text-red-700"><Trash2 size={16} /> Delete</button>
        </div>}
      </div>
    </div>
  );
}

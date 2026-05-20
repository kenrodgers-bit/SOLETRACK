export default function StatCard({ label, value, icon: Icon, danger = false }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className={`mt-1 text-2xl font-bold ${danger ? 'text-red-600' : 'text-gray-900'}`}>{value}</p>
        </div>
        {Icon && <div className={`rounded-2xl p-3 ${danger ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'}`}><Icon size={22} /></div>}
      </div>
    </div>
  );
}

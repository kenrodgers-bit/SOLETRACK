import { useEffect, useMemo, useState } from 'react';
import { Package, Banknote, TriangleAlert, Boxes } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';

export default function Dashboard() {
  const { user } = useAuth();
  const [shoes, setShoes] = useState([]);
  const [today, setToday] = useState({ sales: [], totalRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    const [shoeRes, todayRes] = await Promise.all([api.get('/shoes'), api.get('/sales/today')]);
    setShoes(shoeRes.data); setToday(todayRes.data); setLoading(false);
  };
  useEffect(() => { load().catch(() => setLoading(false)); }, []);
  const totalPairs = shoes.reduce((sum, s) => sum + (s.sizes || []).reduce((a, b) => a + Number(b.quantity || 0), 0), 0);
  const lowCount = useMemo(() => shoes.flatMap(s => (s.sizes || []).filter(z => z.quantity <= s.lowStockThreshold)).length, [shoes]);
  return <main className="safe-bottom mx-auto max-w-5xl p-4">
    <section className="mb-5">
      <p className="text-gray-500">Welcome back,</p>
      <h1 className="text-3xl font-black">{user?.name}</h1>
    </section>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Shoe Models" value={loading ? '...' : shoes.length} icon={Package} />
      <StatCard label="Pairs in Stock" value={loading ? '...' : totalPairs} icon={Boxes} />
      <StatCard label="Low Stock Items" value={loading ? '...' : lowCount} icon={TriangleAlert} danger={lowCount > 0} />
      <StatCard label="Today's Revenue" value={`KES ${Number(today.totalRevenue || 0).toLocaleString()}`} icon={Banknote} />
    </div>
    <section className="card mt-5">
      <h2 className="text-lg font-bold">Recent Sales</h2>
      <div className="mt-3 space-y-3">
        {today.sales?.slice(0,5).map(sale => <div key={sale._id} className="flex justify-between gap-3 rounded-xl bg-gray-50 p-3">
          <div><p className="font-semibold">{sale.shoeName}</p><p className="text-sm text-gray-500">Size {sale.size} · Qty {sale.qtySold} · {sale.soldByName}</p></div>
          <p className="font-bold">KES {Number(sale.totalAmount).toLocaleString()}</p>
        </div>)}
        {!today.sales?.length && <p className="rounded-xl bg-gray-50 p-4 text-center text-gray-500">No sales today yet.</p>}
      </div>
    </section>
  </main>;
}

import { Home, Package, ReceiptText, TriangleAlert, MoreHorizontal, LogOut, Users } from 'lucide-react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const linkClass = ({ isActive }) => `flex flex-col items-center justify-center gap-1 text-xs font-semibold ${isActive ? 'text-indigo-600' : 'text-gray-400'}`;

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  if (location.pathname === '/login') return null;
  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setOpen(false)} />}
      <div className={`fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-white p-4 shadow-soft transition-transform ${open ? 'translate-y-0' : 'translate-y-full'}`} style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}>
        <div className="mx-auto h-1 w-12 rounded-full bg-gray-200" />
        <div className="mt-4 space-y-2">
          {isAdmin && <button className="btn-soft w-full justify-start gap-3" onClick={() => { setOpen(false); navigate('/staff'); }}><Users size={18} /> Staff Manager</button>}
          <button className="btn w-full justify-start gap-3 bg-red-50 text-red-700" onClick={() => { logout(); navigate('/login'); }}><LogOut size={18} /> Logout</button>
        </div>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-100 bg-white/95 px-2 py-2 backdrop-blur" style={{ paddingBottom: 'calc(.5rem + env(safe-area-inset-bottom))' }}>
        <div className="mx-auto grid max-w-xl grid-cols-5">
          <NavLink to="/" className={linkClass}><Home size={22} />Home</NavLink>
          <NavLink to="/inventory" className={linkClass}><Package size={22} />Inventory</NavLink>
          <NavLink to="/sales" className={linkClass}><ReceiptText size={22} />Sales</NavLink>
          <NavLink to="/alerts" className={linkClass}><TriangleAlert size={22} />Alerts</NavLink>
          <button onClick={() => setOpen(true)} className="flex flex-col items-center justify-center gap-1 text-xs font-semibold text-gray-400"><MoreHorizontal size={22} />More</button>
        </div>
      </nav>
    </>
  );
}

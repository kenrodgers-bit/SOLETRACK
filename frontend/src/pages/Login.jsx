import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footprints } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isPin = /^\d{0,6}$/.test(identifier) && !identifier.includes('@');
  const isAdmin = identifier.includes('@');

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(isAdmin ? { email: identifier, password } : { pin: identifier });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally { setLoading(false); }
  };

  return <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-white p-5">
    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-soft">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-600 text-white"><Footprints size={32} /></div>
      <h1 className="mt-5 text-center text-3xl font-black">SoleTrack</h1>
      <p className="mt-2 text-center text-gray-500">{isAdmin ? 'Admin Login' : 'Staff PIN Login'}</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <input className="input text-center" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="6-digit PIN or admin email" type={isPin ? 'tel' : 'email'} autoFocus />
        {isAdmin && <input className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />}
        <button className="btn-primary w-full" disabled={loading || (!isAdmin && identifier.length !== 6)}>{loading ? 'Logging in...' : 'Login'}</button>
      </form>
    </div>
  </main>;
}

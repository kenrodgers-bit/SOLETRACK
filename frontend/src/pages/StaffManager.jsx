import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function StaffManager() {
  const [staff,setStaff]=useState([]); const [name,setName]=useState(''); const [pin,setPin]=useState(''); const [error,setError]=useState('');
  const load=async()=>setStaff((await api.get('/staff')).data);
  useEffect(()=>{load();},[]);
  const add=async(e)=>{e.preventDefault(); setError(''); try{await api.post('/staff',{name,pin}); setName(''); setPin(''); load();}catch(err){setError(err.response?.data?.message||'Failed.')}};
  const reset=async(s)=>{const next=prompt(`New 6-digit PIN for ${s.name}`); if(next){await api.put(`/staff/${s._id}`,{pin:next}); load();}};
  const rename=async(s)=>{const next=prompt('New staff name',s.name); if(next){await api.put(`/staff/${s._id}`,{name:next}); load();}};
  const remove=async(s)=>{if(confirm(`Delete ${s.name}?`)){await api.delete(`/staff/${s._id}`); load();}};
  return <main className="safe-bottom mx-auto max-w-3xl p-4"><h1 className="text-3xl font-black">Staff Manager</h1><p className="mb-4 text-gray-500">Create and manage staff PIN accounts</p><form onSubmit={add} className="card mb-4 space-y-3">{error&&<p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<input className="input" placeholder="Staff name" value={name} onChange={e=>setName(e.target.value)} required/><input className="input" placeholder="6-digit PIN" type="tel" value={pin} onChange={e=>setPin(e.target.value)} required/><button className="btn-primary w-full">Add Staff</button></form><div className="space-y-3">{staff.map(s=><div key={s._id} className="card"><div className="flex items-center justify-between gap-3"><div><p className="font-bold">{s.name}</p><p className="text-sm text-gray-500">PIN hidden · Created {new Date(s.createdAt).toLocaleDateString()}</p></div></div><div className="mt-3 grid grid-cols-3 gap-2"><button className="btn-soft" onClick={()=>rename(s)}>Rename</button><button className="btn-soft" onClick={()=>reset(s)}>Reset PIN</button><button className="btn bg-red-50 text-red-700" onClick={()=>remove(s)}>Delete</button></div></div>)}</div></main>;
}

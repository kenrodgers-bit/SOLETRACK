import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import BottomNav from './components/BottomNav';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import AddEditShoe from './pages/AddEditShoe';
import LowStock from './pages/LowStock';
import Sales from './pages/Sales';
import StaffManager from './pages/StaffManager';

export default function App() {
  return <AuthProvider><BrowserRouter><Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
    <Route path="/inventory/add" element={<ProtectedRoute adminOnly><AddEditShoe /></ProtectedRoute>} />
    <Route path="/inventory/edit/:id" element={<ProtectedRoute adminOnly><AddEditShoe /></ProtectedRoute>} />
    <Route path="/alerts" element={<ProtectedRoute><LowStock /></ProtectedRoute>} />
    <Route path="/sales" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
    <Route path="/staff" element={<ProtectedRoute adminOnly><StaffManager /></ProtectedRoute>} />
  </Routes><BottomNav /></BrowserRouter></AuthProvider>;
}

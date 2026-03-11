import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import AdminScreen from './components/screens/AdminScreen/AdminScreen';
import ClubScreen from './components/screens/ClubScreen/ClubScreen';
import StaffScreen from './components/screens/StaffScreen/StaffScreen';
import CategoriasScreen from './components/screens/CategoriasScreen/CategoriasScreen';
import JugadoresScreen from './components/screens/JugadoresScreen/JugadoresScreen';
import EquiposScreen from './components/screens/EquiposScreen/EquiposScreen';
import EventosScreen from './components/screens/EventosScreen/EventosScreen';
import VerEventoScreen from './components/screens/VerEventoScreen/VerEventoScreen';
import MisEventosScreen from './components/screens/MisEventosScreen/MisEventosScreen';
import VerMiEventoScreen from './components/screens/MisEventosScreen/VerMiEventoScreen';
import './index.css';

const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element, allowedRoles?: string[] }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('rol');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
     if (userRole === 'CLUB') return <Navigate to="/club" replace />;
     if (userRole === 'ADMIN') return <Navigate to="/admin" replace />;
     return <Navigate to="/" replace />;
  }

  return children;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminScreen />
          </ProtectedRoute>
        } />
        <Route path="/club" element={
          <ProtectedRoute allowedRoles={['CLUB', 'ADMIN']}>
            <ClubScreen />
          </ProtectedRoute>
        } />
        <Route path="/club/staff" element={
          <ProtectedRoute allowedRoles={['CLUB','ADMIN']}>
            <StaffScreen />
          </ProtectedRoute>
        } />
        <Route path="/club/categorias" element={
          <ProtectedRoute allowedRoles={['CLUB','ADMIN']}>
            <CategoriasScreen />
          </ProtectedRoute>
        } />
        <Route path="/club/jugadores" element={
          <ProtectedRoute allowedRoles={['CLUB','ADMIN']}>
            <JugadoresScreen />
          </ProtectedRoute>
        } />
        <Route path="/club/equipos" element={
          <ProtectedRoute allowedRoles={['CLUB','ADMIN']}>
            <EquiposScreen />
          </ProtectedRoute>
        } />
        <Route path="/club/eventos" element={
          <ProtectedRoute allowedRoles={['CLUB','ADMIN']}>
            <MisEventosScreen />
          </ProtectedRoute>
        } />
        <Route path="/club/eventos/:id" element={
          <ProtectedRoute allowedRoles={['CLUB','ADMIN']}>
            <VerMiEventoScreen />
          </ProtectedRoute>
        } />
        <Route path="/eventos" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <EventosScreen />
          </ProtectedRoute>
        } />
        <Route path="/eventos/ver/:id" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <VerEventoScreen />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

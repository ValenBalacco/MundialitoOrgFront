import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import AdminScreen from './components/screens/AdminScreen/AdminScreen';
import ClubScreen from './components/screens/ClubScreen/ClubScreen';
import StaffScreen from './components/screens/StaffScreen/StaffScreen';
import CategoriasScreen from './components/screens/CategoriasScreen/CategoriasScreen';
import JugadoresScreen from './components/screens/JugadoresScreen/JugadoresScreen';
import EquiposScreen from './components/screens/EquiposScreen/EquiposScreen';
import EventosScreen from './components/screens/EventosScreen/EventosScreen';
import CreateEditEventoForm from './components/screens/EventosScreen/CreateEditEventoForm';
import VerEventoScreen from './components/screens/VerEventoScreen/VerEventoScreen';
import MisEventosScreen from './components/screens/MisEventosScreen/MisEventosScreen';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<AdminScreen />} />
        <Route path="/club" element={<ClubScreen />} />
        <Route path="/club/staff" element={<StaffScreen />} />
        <Route path="/club/categorias" element={<CategoriasScreen />} />
        <Route path="/club/jugadores" element={<JugadoresScreen />} />
        <Route path="/club/equipos" element={<EquiposScreen />} />
        <Route path="/club/eventos" element={<MisEventosScreen />} />
        <Route path="/eventos" element={<EventosScreen />} />
        <Route path="/eventos/crear" element={<CreateEditEventoForm />} />
        <Route path="/eventos/editar/:id" element={<CreateEditEventoForm />} />
        <Route path="/eventos/ver/:id" element={<VerEventoScreen />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

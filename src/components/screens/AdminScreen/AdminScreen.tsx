import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminScreen.module.css';
import { MdPersonAdd, MdSettings, MdGroups, MdEvent, MdLogout, MdLogin } from 'react-icons/md';
import CreateUsuarioModal from '../../ui/usuarios/CreateUsuarioModal';
import CreateClubModal from '../../ui/Club/CreateClubModal';
import IngresarClubesModal from '../../ui/Club/IngresarClubesModal';
import GestionarClubesModal from '../../ui/Club/GestionarClubesModal';
import GestionarUsuariosModal from '../../ui/usuarios/GestionarUsuariosModal';

const AdminScreen = () => {
  const [openUsuarioModal, setOpenUsuarioModal] = useState(false);
  const [openClubModal, setOpenClubModal] = useState(false);
  const [openGestionarUsuarios, setOpenGestionarUsuarios] = useState(false);
  const [openIngresarClubes, setOpenIngresarClubes] = useState(false);
  const [openGestionarClubes, setOpenGestionarClubes] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('club');
    localStorage.removeItem('clubId');
    window.location.href = '/';
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <MdLogout className={styles.cardBtnIcon} /> Deslogueo
        </button>
      </div>
      <div className={styles.grid}>
        {/* Tarjeta Usuarios */}
        <div className={styles.card}>
          <div className={styles.iconUsuarios}>
            <MdPersonAdd size={60} color="white" />
          </div>
          <h2 className={styles.cardTitle}>Usuarios</h2>
          <button className={styles.cardBtn} onClick={() => setOpenUsuarioModal(true)}>
            <MdPersonAdd className={styles.cardBtnIcon} /> Crear Usuario
          </button>
          <button className={styles.cardBtn} onClick={() => setOpenGestionarUsuarios(true)}>
            <MdSettings className={styles.cardBtnIcon} /> Gestionar Usuarios
          </button>
        </div>

        {/* Tarjeta Clubes */}
        <div className={styles.card}>
          <div className={styles.iconClubes}>
            <MdGroups size={60} color="white" />
          </div>
          <h2 className={styles.cardTitle}>Clubes</h2>
          <button className={styles.cardBtn} onClick={() => setOpenClubModal(true)}>
            <MdPersonAdd className={styles.cardBtnIcon} /> Crear Club
          </button>
          <button className={styles.cardBtn} onClick={() => setOpenGestionarClubes(true)}>
            <MdSettings className={styles.cardBtnIcon} /> Gestionar Clubes
          </button>
          <button className={styles.cardBtn} onClick={() => setOpenIngresarClubes(true)}>
            <MdLogin className={styles.cardBtnIcon} /> Ingresar en Clubes
          </button>
        </div>

        {/* Tarjeta Eventos */}
        <div className={styles.card}>
          <div className={styles.iconEventos}>
            <MdEvent size={60} color="white" />
          </div>
          <h2 className={styles.cardTitle}>Eventos</h2>
          <button className={styles.cardBtn} onClick={() => navigate('/eventos')}>
            <MdSettings className={styles.cardBtnIcon} /> Gestionar Eventos
          </button>
        </div>
      </div>

      {/* Modales */}
      <CreateUsuarioModal open={openUsuarioModal} onClose={() => setOpenUsuarioModal(false)} />
      <CreateClubModal open={openClubModal} onClose={() => setOpenClubModal(false)} />
      <GestionarUsuariosModal open={openGestionarUsuarios} onClose={() => setOpenGestionarUsuarios(false)} />
      <IngresarClubesModal open={openIngresarClubes} onClose={() => setOpenIngresarClubes(false)} />
      <GestionarClubesModal open={openGestionarClubes} onClose={() => setOpenGestionarClubes(false)} />
    </div>
  );
};

export default AdminScreen;
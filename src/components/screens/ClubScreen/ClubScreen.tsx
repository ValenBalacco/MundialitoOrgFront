import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ClubScreen.module.css';
import { getUsuarioByUsername } from '../../../api/usuarioService';
import type { Clubes, Usuario } from '../../../types';
import { FaUsers, FaUserShield, FaLayerGroup, FaRunning, FaSignOutAlt, FaCalendarAlt } from 'react-icons/fa';

const ClubScreen = () => {
  const [club, setClub] = useState<Clubes | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClub = async () => {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');
      if (username && token) {
        const usuario: Usuario | null = await getUsuarioByUsername(username);
        if (usuario && usuario.club) {
          setClub(usuario.club);
          // Store clubId in local storage if needed elsewhere
          localStorage.setItem('clubId', usuario.club.cod.toString());
        }
      }
    };
    fetchClub();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('club');
    localStorage.removeItem('clubId');
    navigate('/');
  };

  const clubName = club?.nombre || 'Panel de Club';

  return (
    <>
      <div className={styles.wrapper}>
        <button onClick={handleLogout} className={styles.logoutButton} title="Cerrar Sesión">
          <FaSignOutAlt className={styles.logoutIcon} />
        </button>
        <div className={styles.panelContainer}>
          <h2 className={styles.panelTitle}>{clubName}</h2>
          <div className={styles.grid}>
            <div className={styles.card} onClick={() => navigate('/club/staff')}>
              <FaUserShield className={`${styles.icon} ${styles.iconStaff}`} />
              <div className={styles.cardLabel}>Staff</div>
            </div>
            <div className={styles.card} onClick={() => navigate('/club/equipos')}>
              <FaUsers className={`${styles.icon} ${styles.iconEquipos}`} />
              <div className={styles.cardLabel}>Equipos</div>
            </div>
            <div className={styles.card} onClick={() => navigate('/club/categorias')}>
              <FaLayerGroup className={`${styles.icon} ${styles.iconCategorias}`} />
              <div className={styles.cardLabel}>Categorías</div>
            </div>
            <div className={styles.card} onClick={() => navigate('/club/jugadores')}>
              <FaRunning className={`${styles.icon} ${styles.iconJugadores}`} />
              <div className={styles.cardLabel}>Jugadores</div>
            </div>
            <div className={styles.card} onClick={() => navigate('/club/eventos')}>
              <FaCalendarAlt className={`${styles.icon} ${styles.iconEventos}`} />
              <div className={styles.cardLabel}>Mis Eventos</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClubScreen;

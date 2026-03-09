import { useNavigate, useLocation } from 'react-router-dom';
import styles from './SlideBoard.module.css';
import { FaUsers, FaUserShield, FaLayerGroup, FaRunning, FaArrowLeft, FaCalendarAlt } from 'react-icons/fa';

const SlideBoard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const buttons = [
    { path: '/club/equipos', label: 'Equipos', icon: <FaUsers /> },
    { path: '/club/staff', label: 'Staff', icon: <FaUserShield /> },
    { path: '/club/categorias', label: 'Categorías', icon: <FaLayerGroup /> },
    { path: '/club/jugadores', label: 'Jugadores', icon: <FaRunning /> },
    { path: '/club/eventos', label: 'Mis Eventos', icon: <FaCalendarAlt /> }
  ];

  return (
    <nav className={styles.slideBoard}>
      {buttons.map(btn => (
        <button
          key={btn.path}
          className={location.pathname.startsWith(btn.path) ? styles.active : ''}
          onClick={() => navigate(btn.path)}
          title={btn.label}
        >
          <span className={styles.icon}>{btn.icon}</span>
          <span>{btn.label}</span>
        </button>
      ))}
      <button className={styles.backBtn} onClick={() => navigate('/club')} title="Volver al Club">
        <span className={styles.icon}><FaArrowLeft /></span>
        <span>Volver al Club</span>
      </button>
    </nav>
  );
};

export default SlideBoard;
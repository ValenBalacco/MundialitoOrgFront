import { useState, useEffect } from 'react';
import { getUsuarios } from '../../../api/usuarioService';
import styles from './Modal.module.css';
import type { Usuario } from '../../../types';

interface Props {
  open: boolean;
  onClose: () => void;
}

const VerUsuariosModal = ({ open, onClose }: Props) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    if (open) {
      getUsuarios().then(setUsuarios);
    }
  }, [open]);

  if (!open) return null;
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Lista de Usuarios</h3>
        <ul className={styles.userList}>
          {usuarios.map(u => (
            <li
              key={u.id}
              className={styles.userItem}
            >
              <span className={styles.userIcon}>👤</span>
              <span className={styles.userName}>{u.username}</span>
              <span className={styles.userRole}>{u.rol}</span>
            </li>
          ))}
        </ul>
        <button className={styles.closeBtn} onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default VerUsuariosModal;
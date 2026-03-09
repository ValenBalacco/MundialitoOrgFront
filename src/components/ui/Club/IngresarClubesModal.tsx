import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './IngresarClubesModal.module.css';
import { getClubes } from '../../../api/clubesService';
import { getUsuarioByUsername, updateUsuario } from '../../../api/usuarioService';
import type { Clubes, Usuario } from '../../../types';
import { FaTimes, FaBuilding } from 'react-icons/fa';

interface Props {
  open: boolean;
  onClose: () => void;
}

const IngresarClubesModal = ({ open, onClose }: Props) => {
  const [clubes, setClubes] = useState<Clubes[]>([]);
  const navigate = useNavigate();

  const handleSelectClub = async (club: Clubes) => {
    const username = localStorage.getItem('username');
    if (username) {
      const usuario: Usuario | null = await getUsuarioByUsername(username);
      if (usuario) {
        await updateUsuario(usuario.id, { ...usuario, club });
      }
    }
    localStorage.setItem('clubId', club.cod.toString());
    onClose();
    navigate('/club');
  };

  useEffect(() => {
    if (open) {
      getClubes().then(setClubes);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}><FaTimes /></button>
        <h3 className={styles.title}>Seleccionar Club</h3>
        <div className={styles.clubGrid}>
          {clubes.map(c => (
            <div key={c.cod} className={styles.clubCard} onClick={() => handleSelectClub(c)}>
              <div className={styles.clubIcon}>
                {c.escudo ? (
                  <img src={c.escudo} alt={`Escudo de ${c.nombre}`} />
                ) : (
                  <FaBuilding />
                )}
              </div>
              <div className={styles.clubName}>{c.nombre}</div>
              <div className={styles.clubLocalidad}>{c.localidad}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IngresarClubesModal;

import { useEffect, useState } from 'react';
import type { Usuario, Clubes } from '../../../types';
import { getClubes } from '../../../api/clubesService';
import styles from './Modal.module.css';
import { MdClose } from 'react-icons/md';

interface Props {
  open: boolean;
  usuario: Usuario | null;
  onClose: () => void;
  onSave: (id: number, usuario: Usuario) => Promise<void>;
}

const EditUsuarioModal = ({ open, usuario, onClose, onSave }: Props) => {
  const [username, setUsername] = useState('');
  const [rol, setRol] = useState<'ADMIN' | 'CLUB'>('CLUB');
  const [activo, setActivo] = useState(true);
  const [clubes, setClubes] = useState<Clubes[]>([]);
  const [club, setClub] = useState<Clubes | null | undefined>(null);

  useEffect(() => {
    if (usuario) {
      setUsername(usuario.username);
      setRol(usuario.rol);
      setActivo(usuario.activo);
      setClub(usuario.club);
    }
  }, [usuario]);

  useEffect(() => {
    if (rol === 'CLUB') {
      getClubes().then(setClubes);
    }
  }, [rol]);

  if (!open || !usuario) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedUsuario: Usuario = {
      ...usuario,
      username,
      rol,
      activo,
      club: rol === 'ADMIN' ? undefined : club ?? undefined,
    };

    await onSave(usuario.id, updatedUsuario);
    onClose();
  };

  return (
    <div className={styles.darkOverlay}>
      <div className={styles.darkModal}>
        <button className={styles.closeIcon} onClick={onClose}>
          <MdClose size={28} />
        </button>
        <h3 className={styles.darkTitle}>Editar Usuario</h3>
        <form className={styles.darkForm} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Nombre de Usuario</label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Rol</label>
              <select
                value={rol}
                onChange={e => setRol(e.target.value as 'ADMIN' | 'CLUB')}
              >
                <option value="ADMIN">ADMIN</option>
                <option value="CLUB">CLUB</option>
              </select>
            </div>
            {rol === 'CLUB' && (
              <div className={styles.field}>
                <label>Club</label>
                <select
                  value={club?.cod ?? ''}
                  onChange={e => {
                    const selectedClub = clubes.find(
                      c => c.cod === Number(e.target.value)
                    );
                    setClub(selectedClub ?? null);
                  }}
                  required
                >
                  <option value="">Selecciona un club</option>
                  {clubes.map(c => (
                    <option key={c.cod} value={c.cod}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label style={{ flexDirection: 'row', alignItems: 'center' }}>
                Activo
                <input
                  type="checkbox"
                  checked={activo}
                  onChange={e => setActivo(e.target.checked)}
                  style={{ width: 'auto', marginLeft: '1rem' }}
                />
              </label>
            </div>
          </div>
          <button type="submit" className={styles.darkBtn}>
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUsuarioModal;

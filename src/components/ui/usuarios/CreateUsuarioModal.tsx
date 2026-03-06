import { useState, useEffect } from 'react';
import type { Usuario, Clubes } from '../../../types';
import { crearUsuario } from '../../../api/usuarioService';
import { getClubes } from '../../../api/clubesService';
import styles from './Modal.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated?: (usuario: Usuario) => void;
}

const CreateUsuarioModal = ({ open, onClose, onCreated }: Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState<'ADMIN' | 'CLUB'>('CLUB');
  const [clubId, setClubId] = useState<number | null>(null);
  const [clubes, setClubes] = useState<Clubes[]>([]);

  useEffect(() => {
    if (rol === 'CLUB') {
      getClubes().then(setClubes);
    }
  }, [rol]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let nuevoUsuario: any = {
      username,
      password,
      rol,
      activo: true,
    };

    // ✅ Si el rol es ADMIN → asignar club cod 1
    // ✅ Si es CLUB → asignar el club seleccionado
    if (rol === 'ADMIN') {
      nuevoUsuario.club = { cod: 1 };
    } else if (rol === 'CLUB' && clubId) {
      nuevoUsuario.club = { cod: clubId };
    }

    const usuarioCreado = await crearUsuario(nuevoUsuario);
    onCreated?.(usuarioCreado);
    onClose();
  };

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Crear Usuario</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Usuario</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Ingrese el nombre de usuario"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Ingrese una contraseña"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Rol</label>
            <select
              value={rol}
              onChange={e => setRol(e.target.value as 'ADMIN' | 'CLUB')}
            >
              <option value="ADMIN">Administrador</option>
              <option value="CLUB">Club</option>
            </select>
          </div>

          {rol === 'CLUB' && (
            <div className={styles.formGroup}>
              <label>Club</label>
              <select
                value={clubId ?? ''}
                onChange={e => setClubId(Number(e.target.value))}
                required
              >
                <option value="">Selecciona un club</option>
                {clubes.map(club => (
                  <option key={club.cod} value={club.cod}>
                    {club.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className={styles.actions}>
            <button type="submit" className={styles.createBtn}>
              Crear
            </button>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUsuarioModal;

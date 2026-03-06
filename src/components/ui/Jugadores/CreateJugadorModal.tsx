import { useState } from 'react';
import type { Jugador } from '../../../types';
import { createJugador } from '../../../api/jugadorService';
import styles from './Modal.module.css';
import { MdClose, MdPhotoCamera } from 'react-icons/md';
import { uploadToCloudinary } from '../../../utils/cloudinary';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated?: (jugador: Jugador) => void;
}

const CreateJugadorModal = ({ open, onClose, onCreated }: Props) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [numeroCamiseta, setNumeroCamiseta] = useState('');
  const [demarcacion, setDemarcacion] = useState('');
  const [foto, setFoto] = useState('');
  const [uploading, setUploading] = useState(false);
  const [activo] = useState(true);

  if (!open) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const imageUrl = await uploadToCloudinary(file);
        setFoto(imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clubId = localStorage.getItem('clubId');
    const nombreCompleto = `${nombre} ${apellido}`.trim();
    const nuevoJugador = {
      nombre: nombreCompleto,
      fechaNacimiento,
      numeroDocumento,
      numeroCamiseta: numeroCamiseta ? Number(numeroCamiseta) : undefined,
      demarcacion,
      foto,
      activo,
      goles: 0,
      amarilla: 0,
      tarjetaRoja: 0,
      equipo: null,
      categoria: null,
      club: clubId ? { cod: Number(clubId) } : undefined,
    };
    const jugadorCreado = await createJugador(nuevoJugador as any);
    onCreated?.(jugadorCreado);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeIcon} onClick={onClose}>
          <MdClose size={28} />
        </button>

        <h3 className={styles.title}>Crear Jugador</h3>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Nombre</label>
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
            <div className={styles.field}>
              <label>Apellido</label>
              <input value={apellido} onChange={(e) => setApellido(e.target.value)} required />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Fecha de nacimiento</label>
              <input type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} required />
            </div>
            <div className={styles.field}>
              <label>Número de camiseta</label>
              <input value={numeroCamiseta} onChange={(e) => setNumeroCamiseta(e.target.value)} required />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Número de documento</label>
              <input value={numeroDocumento} onChange={(e) => setNumeroDocumento(e.target.value)} required />
            </div>
            <div className={styles.field}>
              <label>Demarcación</label>
              <input value={demarcacion} onChange={(e) => setDemarcacion(e.target.value)} required />
            </div>
          </div>

          <div className={styles.fotoField}>
            <label htmlFor="fotoInput" className={styles.fotoLabel}>
              <MdPhotoCamera size={28} />
              <span>Cargar foto</span>
            </label>
            <input
              id="fotoInput"
              type="file"
              onChange={handleFileChange}
              className={styles.fotoInput}
            />
            {uploading && <p>Cargando imagen...</p>}
            {foto && !uploading && <img src={foto} alt="Vista previa" className={styles.fotoPreview} />}
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.saveBtn} disabled={uploading}>
              {uploading ? 'Guardando...' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJugadorModal;

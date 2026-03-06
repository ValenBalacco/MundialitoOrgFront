import { useState, useEffect } from 'react';
import type { Staff } from '../../../types';
import { createStaff } from '../../../api/staffService';
import styles from './Modal.module.css';
import { MdClose, MdPhotoCamera } from 'react-icons/md';
import { uploadToCloudinary } from '../../../utils/cloudinary';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated?: (staff: Staff) => void;
}

const CreateStaffModal = ({ open, onClose, onCreated }: Props) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [cargo, setCargo] = useState('');
  const [foto, setFoto] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (open) {
      setNombre('');
      setApellido('');
      setCargo('');
      setFoto('');
    }
  }, [open]);

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
    const nuevoStaff = {
      nombre: nombreCompleto,
      cargo,
      foto,
      activo: true,
      equipo: null,
      categoria: null,
      club: clubId ? { cod: Number(clubId) } : undefined
    };
    const staffCreado = await createStaff(nuevoStaff as any);
    onCreated?.(staffCreado);
    // Reset fields
    setNombre('');
    setApellido('');
    setCargo('');
    setFoto('');
    onClose();
  };

  if (!open) return null;
  return (
    <div className={styles.darkOverlay}>
      <div className={styles.darkModal}>
        <button className={styles.closeIcon} onClick={onClose}>
          <MdClose size={28} />
        </button>
        <h3 className={styles.darkTitle}>Crear nuevo staff</h3>
        <form className={styles.darkForm} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Nombre</label>
              <input value={nombre} onChange={e => setNombre(e.target.value)} required />
            </div>
            <div className={styles.field}>
              <label>Apellido</label>
              <input value={apellido} onChange={e => setApellido(e.target.value)} required />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Cargo</label>
              <input value={cargo} onChange={e => setCargo(e.target.value)} required />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.fotoField}>
              <label htmlFor="fotoStaffInput" className={styles.fotoLabel}>
                <MdPhotoCamera size={32} />
                <span>Cargar foto</span>
              </label>
              <input
                id="fotoStaffInput"
                type="file"
                onChange={handleFileChange}
                className={styles.fotoInput}
              />
              {uploading && <p>Cargando imagen...</p>}
              {foto && !uploading && <img src={foto} alt="Vista previa" className={styles.fotoPreview} />}
            </div>
          </div>
          <button type="submit" className={styles.darkBtn} disabled={uploading}>
            {uploading ? 'Guardando...' : 'Crear'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateStaffModal;
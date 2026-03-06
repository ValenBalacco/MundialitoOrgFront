import { useEffect, useState } from 'react';
import type { Staff } from '../../../types';
import styles from './Modal.module.css';
import { MdClose, MdPhotoCamera } from 'react-icons/md';
import { uploadToCloudinary } from '../../../utils/cloudinary';

interface Props {
  open: boolean;
  staff: Staff | null;
  onClose: () => void;
  onSave: (cod: number, staff: Staff) => Promise<void>;
}

const EditStaffModal = ({ open, staff, onClose, onSave }: Props) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [cargo, setCargo] = useState('');
  const [foto, setFoto] = useState('');
  const [activo, setActivo] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (staff) {
      const [nombrePart, ...apellidoPart] = staff.nombre.split(' ');
      setNombre(nombrePart ?? '');
      setApellido(apellidoPart.join(' ') ?? '');
      setCargo(staff.cargo ?? '');
      setFoto(staff.foto ?? '');
      setActivo(staff.activo ?? true);
    }
  }, [staff]);

  if (!open || !staff) return null;

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
    const nombreCompleto = `${nombre} ${apellido}`.trim();
    const updatedStaff = {
      ...staff,
      nombre: nombreCompleto,
      cargo,
      foto,
      activo,
    };
    await onSave(staff.cod, updatedStaff as Staff);
    onClose();
  };

  return (
    <div className={styles.darkOverlay}>
      <div className={styles.darkModal}>
        <button className={styles.closeIcon} onClick={onClose}>
          <MdClose size={28} />
        </button>
        <h3 className={styles.darkTitle}>Editar staff</h3>
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
              <label htmlFor="fotoStaffInputEdit" className={styles.fotoLabel}>
                <MdPhotoCamera size={32} />
                <span>Cargar foto</span>
              </label>
              <input
                id="fotoStaffInputEdit"
                type="file"
                onChange={handleFileChange}
                className={styles.fotoInput}
              />
              {uploading && <p>Cargando imagen...</p>}
              {foto && !uploading && <img src={foto} alt="Vista previa" className={styles.fotoPreview} />}
            </div>
          </div>
          <div className={styles.field}>
            <label style={{ flexDirection: 'row', alignItems: 'center' }}>Activo <input type="checkbox" checked={activo} onChange={e => setActivo(e.target.checked)} style={{ width: 'auto', marginLeft: '1rem' }} /></label>
          </div>
          <button type="submit" className={styles.darkBtn} disabled={uploading}>
            {uploading ? 'Guardando...' : 'Guardar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditStaffModal;
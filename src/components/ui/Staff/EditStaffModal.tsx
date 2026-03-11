import { useEffect, useState } from 'react';
import type { Staff } from '../../../types';
import styles from './Modal.module.css';
import { updateStaff } from '../../../api/staffService';
import { MdClose, MdPhotoCamera } from 'react-icons/md';
import { uploadToCloudinary } from '../../../utils/cloudinary';

interface Props {
  open: boolean;
  staff: Staff | null;
  onClose: () => void;
  onSave: (cod: number, staff: Staff) => void;
}

const EditStaffModal = ({ open, staff, onClose, onSave }: Props) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [nacionalidad, setNacionalidad] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [cargo, setCargo] = useState('');
  const [foto, setFoto] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [activo, setActivo] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (staff) {
      setNombre(staff.nombre ?? '');
      setApellido(staff.apellido ?? '');
      setNumeroDocumento(staff.numeroDocumento ?? '');
      setFechaNacimiento(staff.fechaNacimiento ?? '');
      setNacionalidad(staff.nacionalidad ?? '');
      setTelefono(staff.telefono ?? '');
      setEmail(staff.email ?? '');
      setCargo(staff.cargo ?? '');
      setFoto(staff.foto ?? '');
      setObservaciones(staff.observaciones ?? '');
      setActivo(staff.activo ?? true);
    }
  }, [staff]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };
    if (open) {
        window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

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
    const updatedStaff = {
      ...staff,
      nombre,
      apellido,
      numeroDocumento,
      fechaNacimiento,
      nacionalidad,
      telefono,
      email,
      cargo,
      foto,
      observaciones,
      activo,
    };
    onSave(staff.cod, updatedStaff as Staff);
  };

  const isFormInvalid = !nombre.trim() || !apellido.trim() || !cargo.trim();

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeIcon} onClick={onClose}>
          <MdClose size={28} />
        </button>
        <h3 className={styles.title}>Editar staff</h3>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Nombre <span className={styles.required}>*</span></label>
              <input value={nombre} onChange={e => setNombre(e.target.value)} required />
            </div>
            <div className={styles.field}>
              <label>Apellido <span className={styles.required}>*</span></label>
              <input value={apellido} onChange={e => setApellido(e.target.value)} required />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Nro de Documento</label>
              <input value={numeroDocumento} onChange={(e) => setNumeroDocumento(e.target.value)} />
            </div>
            <div className={styles.field}>
              <label>Fecha de Nacimiento</label>
              <input type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Nacionalidad</label>
              <input value={nacionalidad} onChange={(e) => setNacionalidad(e.target.value)} />
            </div>
            <div className={styles.field}>
              <label>Teléfono</label>
              <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Cargo <span className={styles.required}>*</span></label>
              <input value={cargo} onChange={e => setCargo(e.target.value)} required />
            </div>
            <div className={styles.field}>
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <textarea className={styles.textarea} placeholder="Observaciones" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />
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
          <div className={styles.switchField}>
            <label>
              <input type="checkbox" checked={activo} onChange={e => setActivo(e.target.checked)} />
              Activo
            </label>
          </div>
          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.saveBtn} disabled={uploading || isFormInvalid}>
              {uploading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStaffModal;
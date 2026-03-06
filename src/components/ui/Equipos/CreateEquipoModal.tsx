import { useState } from 'react';
import type { Equipos } from '../../../types';
import { createEquipo } from '../../../api/equiposService';
import styles from './Modal.module.css';
import { MdClose, MdPhotoCamera, MdGroup, MdGroups } from 'react-icons/md';
import { uploadToCloudinary } from '../../../utils/cloudinary';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated?: (equipo: Equipos) => void;
}

const CreateEquipoModal = ({ open, onClose, onCreated }: Props) => {
  const [nombreEquipo, setNombreEquipo] = useState('');
  const [corto, setCorto] = useState('');
  const [grupo, setGrupo] = useState('');
  const [nJugadores, setNJugadores] = useState('');
  const [nStaff, setNStaff] = useState('');
  const [nAcompanantes, setNAcompanantes] = useState('');
  const [fotoEquipo, setFotoEquipo] = useState('');
  const [fotoEquipacion1, setFotoEquipacion1] = useState('');
  const [fotoEquipacion2, setFotoEquipacion2] = useState('');
  const [uploading, setUploading] = useState({ fotoEquipo: false, fotoEquipacion1: false, fotoEquipacion2: false });
  const [activo] = useState(true);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof uploading) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(prev => ({ ...prev, [field]: true }));
      try {
        const imageUrl = await uploadToCloudinary(file);
        if (field === 'fotoEquipo') setFotoEquipo(imageUrl);
        if (field === 'fotoEquipacion1') setFotoEquipacion1(imageUrl);
        if (field === 'fotoEquipacion2') setFotoEquipacion2(imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setUploading(prev => ({ ...prev, [field]: false }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clubId = localStorage.getItem('clubId');
    const nuevoEquipo = {
      nombreEquipo: nombreEquipo.trim() || "",
      corto: corto.trim() || "",
      grupo: grupo.trim() || "",
      nJugadores: nJugadores.trim() === '' ? 0 : Number(nJugadores),
      nStaff: nStaff.trim() === '' ? 0 : Number(nStaff),
      nAcompanantes: nAcompanantes.trim() === '' ? 0 : Number(nAcompanantes),
      fotoEquipo: fotoEquipo.trim() || "",
      fotoEquipacion1: fotoEquipacion1.trim() || "",
      fotoEquipacion2: fotoEquipacion2.trim() || "",
      activo,
      categoria: null, // o { cod: categoriaId } si tienes la categoría seleccionada
      club: clubId ? { cod: Number(clubId) } : undefined
    };
    const equipoCreado = await createEquipo(nuevoEquipo as any);
    onCreated?.(equipoCreado);
    onClose();
  };

  if (!open) return null;
  return (
    <div className={styles.darkOverlay}>
      <div className={styles.darkModal}>
        <button className={styles.closeIcon} onClick={onClose}>
          <MdClose size={28} />
        </button>
        <h3 className={styles.darkTitle}>Crear equipo</h3>
        <form className={styles.darkForm} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Nombre equipo</label>
              <input value={nombreEquipo} onChange={e => setNombreEquipo(e.target.value)} required />
            </div>
            <div className={styles.field}>
              <label>Nombre corto</label>
              <input value={corto} onChange={e => setCorto(e.target.value)} />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Grupo</label>
              <input value={grupo} onChange={e => setGrupo(e.target.value)} />
            </div>
            <div className={styles.field}>
              <label>N° Jugadores</label>
              <input
                type="text"
                pattern="[0-9]*"
                inputMode="numeric"
                value={nJugadores}
                onChange={e => setNJugadores(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>N° Staff</label>
              <input
                type="text"
                pattern="[0-9]*"
                inputMode="numeric"
                value={nStaff}
                onChange={e => setNStaff(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label>N° Acompañantes</label>
              <input
                type="text"
                pattern="[0-9]*"
                inputMode="numeric"
                value={nAcompanantes}
                onChange={e => setNAcompanantes(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.fotoField}>
              <label htmlFor="fotoEquipoInput" className={styles.fotoLabel}>
                <MdGroup size={32} />
                <span>Foto equipo</span>
              </label>
              <input
                id="fotoEquipoInput"
                type="file"
                onChange={e => handleFileChange(e, 'fotoEquipo')}
                className={styles.fotoInput}
              />
              {uploading.fotoEquipo && <p>Cargando...</p>}
              {fotoEquipo && !uploading.fotoEquipo && (
                <img src={fotoEquipo} alt="Vista previa equipo" className={styles.fotoPreview} />
              )}
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.fotoField}>
              <label htmlFor="fotoEquipacion1Input" className={styles.fotoLabel}>
                <MdGroups size={32} />
                <span>Foto equipación 1</span>
              </label>
              <input
                id="fotoEquipacion1Input"
                type="file"
                onChange={e => handleFileChange(e, 'fotoEquipacion1')}
                className={styles.fotoInput}
              />
              {uploading.fotoEquipacion1 && <p>Cargando...</p>}
              {fotoEquipacion1 && !uploading.fotoEquipacion1 && (
                <img src={fotoEquipacion1} alt="Vista previa equipación 1" className={styles.fotoPreview} />
              )}
            </div>
            <div className={styles.fotoField}>
              <label htmlFor="fotoEquipacion2Input" className={styles.fotoLabel}>
                <MdGroups size={32} />
                <span>Foto equipación 2</span>
              </label>
              <input
                id="fotoEquipacion2Input"
                type="file"
                onChange={e => handleFileChange(e, 'fotoEquipacion2')}
                className={styles.fotoInput}
              />
              {uploading.fotoEquipacion2 && <p>Cargando...</p>}
              {fotoEquipacion2 && !uploading.fotoEquipacion2 && (
                <img src={fotoEquipacion2} alt="Vista previa equipación 2" className={styles.fotoPreview} />
              )}
            </div>
          </div>
          <button type="submit" className={styles.darkBtn} disabled={uploading.fotoEquipo || uploading.fotoEquipacion1 || uploading.fotoEquipacion2}>
            {uploading.fotoEquipo || uploading.fotoEquipacion1 || uploading.fotoEquipacion2 ? 'Guardando...' : 'Crear'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEquipoModal;
import { useEffect, useState } from 'react';
import type { Equipos, Categoria, EquiposDto } from '../../../types';
import styles from './Modal.module.css';
import { MdClose, MdGroup, MdGroups } from 'react-icons/md';
import { uploadToCloudinary } from '../../../utils/cloudinary';

interface Props {
  open: boolean;
  equipo: Equipos | null;
  categoriasList: Categoria[];
  onClose: () => void;
  onSave: (cod: number, equipo: EquiposDto) => Promise<void>;
}

const EditEquipoModal = ({
  open,
  equipo,
  categoriasList,
  onClose,
  onSave,
}: Props) => {
  const [nombreEquipo, setNombreEquipo] = useState('');
  const [corto, setCorto] = useState('');
  const [grupo, setGrupo] = useState('');
  const [nJugadores, setNJugadores] = useState<number | ''>('');
  const [nStaff, setNStaff] = useState<number | ''>('');
  const [nAcompanantes, setNAcompanantes] = useState<number | ''>('');
  const [fotoEquipo, setFotoEquipo] = useState('');
  const [fotoEquipacion1, setFotoEquipacion1] = useState('');
  const [fotoEquipacion2, setFotoEquipacion2] = useState('');
  const [activo, setActivo] = useState(true);
  const [categoria, setCategoria] = useState<Categoria | undefined>(undefined);
  const [uploading, setUploading] = useState({ fotoEquipo: false, fotoEquipacion1: false, fotoEquipacion2: false });

  useEffect(() => {
    if (equipo) {
      setNombreEquipo(equipo.nombreEquipo ?? '');
      setCorto(equipo.corto ?? '');
      setGrupo(equipo.grupo ?? '');
      setNJugadores(equipo.nJugadores ?? '');
      setNStaff(equipo.nStaff ?? '');
      setNAcompanantes(equipo.nAcompanantes ?? '');
      setFotoEquipo(equipo.fotoEquipo ?? '');
      setFotoEquipacion1(equipo.fotoEquipacion1 ?? '');
      setFotoEquipacion2(equipo.fotoEquipacion2 ?? '');
      setActivo(equipo.activo ?? true);
      setCategoria(equipo.categoria ?? undefined);
    }
  }, [equipo]);

  if (!open || !equipo) return null;

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

  const handleCategoriaChange = (cod: number) => {
    const cat = categoriasList.find(c => c.cod === cod);
    setCategoria(cat ?? undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const equipoDto = {
      ...equipo,
      nombreEquipo,
      corto,
      grupo,
      nJugadores: Number(nJugadores) || 0,
      nStaff: Number(nStaff) || 0,
      nAcompanantes: Number(nAcompanantes) || 0,
      fotoEquipo,
      fotoEquipacion1,
      fotoEquipacion2,
      activo,
      categoria,
      jugadoresIds: equipo.jugadores?.map(j => j.cod) ?? [],
      staffIds: equipo.staff?.map(s => s.cod) ?? [],
    } as EquiposDto;
    await onSave(equipo!.cod, equipoDto);
    onClose();
  };

  return (
    <div className={styles.darkOverlay}>
      <div className={styles.darkModal}>
        <button className={styles.closeIcon} onClick={onClose}>
          <MdClose size={28} />
        </button>
        <h3 className={styles.darkTitle}>Editar equipo</h3>
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
                type="number"
                min={0}
                value={nJugadores}
                onChange={e => setNJugadores(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>
            <div className={styles.field}>
              <label>N° Staff</label>
              <input
                type="number"
                min={0}
                value={nStaff}
                onChange={e => setNStaff(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>
            <div className={styles.field}>
              <label>N° Acompañantes</label>
              <input
                type="number"
                min={0}
                value={nAcompanantes}
                onChange={e => setNAcompanantes(e.target.value === '' ? '' : Number(e.target.value))}
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
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Categoría</label>
              <select
                value={categoria?.cod ?? ''}
                onChange={e => handleCategoriaChange(Number(e.target.value))}
              >
                <option value="">Sin categoría</option>
                {categoriasList.map(cat => (
                  <option key={cat.cod} value={cat.cod}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>
                Activo
                <input type="checkbox" checked={activo} onChange={e => setActivo(e.target.checked)} />
              </label>
            </div>
          </div>
          <button type="submit" className={styles.darkBtn} disabled={uploading.fotoEquipo || uploading.fotoEquipacion1 || uploading.fotoEquipacion2}>
            {uploading.fotoEquipo || uploading.fotoEquipacion1 || uploading.fotoEquipacion2 ? 'Guardando...' : 'Guardar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEquipoModal;

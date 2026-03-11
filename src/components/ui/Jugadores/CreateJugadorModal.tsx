import { useState, useEffect } from 'react';
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
  const [lugarNacimiento, setLugarNacimiento] = useState('');
  const [nacionalidad, setNacionalidad] = useState('');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [numeroCamiseta, setNumeroCamiseta] = useState('');
  const [demarcacion, setDemarcacion] = useState('');
  const [altura, setAltura] = useState('');
  const [peso, setPeso] = useState('');
  const [pieDominante, setPieDominante] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [foto, setFoto] = useState('');
  const [uploading, setUploading] = useState(false);
  const [activo] = useState(true);

  useEffect(() => {
    if (open) {
      setNombre('');
      setApellido('');
      setFechaNacimiento('');
      setLugarNacimiento('');
      setNacionalidad('');
      setNumeroDocumento('');
      setTelefono('');
      setEmail('');
      setNumeroCamiseta('');
      setDemarcacion('');
      setAltura('');
      setPeso('');
      setPieDominante('');
      setObservaciones('');
      setFoto('');
    }
  }, [open]);

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
    const nuevoJugador = {
      nombre,
      apellido,
      fechaNacimiento,
      lugarNacimiento,
      nacionalidad,
      numeroDocumento,
      telefono,
      email,
      numeroCamiseta: numeroCamiseta ? Number(numeroCamiseta) : undefined,
      demarcacion,
      altura: altura ? Number(altura) : undefined,
      peso: peso ? Number(peso) : undefined,
      pieDominante,
      observaciones,
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

  const isFormInvalid =
    !nombre.trim() ||
    !apellido.trim() ||
    !fechaNacimiento.trim() ||
    !numeroDocumento.trim() ||
    !numeroCamiseta.trim() ||
    !demarcacion.trim();

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeIcon} onClick={onClose}>
          <MdClose size={28} />
        </button>

        <h3 className={styles.title}>Crear Jugador</h3>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Nombre <span className={styles.required}>*</span></label>
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
            <div className={styles.field}>
              <label>Apellido <span className={styles.required}>*</span></label>
              <input value={apellido} onChange={(e) => setApellido(e.target.value)} required />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Nro de Documento <span className={styles.required}>*</span></label>
              <input value={numeroDocumento} onChange={(e) => setNumeroDocumento(e.target.value)} required />
            </div>
            <div className={styles.field}>
              <label>Fecha de Nacimiento <span className={styles.required}>*</span></label>
              <input type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} required />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Lugar de Nacimiento</label>
              <input value={lugarNacimiento} onChange={(e) => setLugarNacimiento(e.target.value)} />
            </div>
            <div className={styles.field}>
              <label>Nacionalidad</label>
              <input value={nacionalidad} onChange={(e) => setNacionalidad(e.target.value)} />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Teléfono</label>
              <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
            </div>
            <div className={styles.field}>
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Nro de Camiseta <span className={styles.required}>*</span></label>
              <input value={numeroCamiseta} onChange={(e) => setNumeroCamiseta(e.target.value)} required />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Demarcación <span className={styles.required}>*</span></label>
              <input value={demarcacion} onChange={(e) => setDemarcacion(e.target.value)} required />
            </div>
            <div className={styles.field}>
              <label>Pie Dominante</label>
              <select value={pieDominante} onChange={(e) => setPieDominante(e.target.value)}>
                <option value="">Seleccionar...</option>
                <option value="Derecho">Derecho</option>
                <option value="Izquierdo">Izquierdo</option>
                <option value="Ambidextro">Ambidextro</option>
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Altura (cm)</label>
              <input type="number" value={altura} onChange={(e) => setAltura(e.target.value)} />
            </div>
            <div className={styles.field}>
              <label>Peso (kg)</label>
              <input type="number" step="0.1" value={peso} onChange={(e) => setPeso(e.target.value)} />
            </div>
          </div>

          <textarea className={styles.textarea} placeholder="Observaciones" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />

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
            <button type="submit" className={styles.saveBtn} disabled={uploading || isFormInvalid}>
              {uploading ? 'Guardando...' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJugadorModal;

import { useState } from 'react';
import type { Clubes } from '../../../types';
import { createClub } from '../../../api/clubesService';
import styles from './Modal.module.css';
import { uploadToCloudinary } from '../../../utils/cloudinary';
import Swal from 'sweetalert2';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated?: (club: Clubes) => void;
}

const CreateClubModal = ({ open, onClose, onCreated }: Props) => {
  const [nombre, setNombre] = useState('');
  const [pais, setPais] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [responsable, setResponsable] = useState('');
  const [telefonoClub, setTelefonoClub] = useState('');
  const [faxClub, setFaxClub] = useState('');
  const [telefonoResponsable, setTelefonoResponsable] = useState('');
  const [email, setEmail] = useState('');
  const [idiomaContacto, setIdiomaContacto] = useState('');
  const [escudo, setEscudo] = useState<File | null>(null);
  const [activo, setActivo] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let escudoUrl = '';
    if (escudo) {
        try {
            escudoUrl = await uploadToCloudinary(escudo);
        } catch (error) {
            console.error("Error uploading image", error);
            Swal.fire('Error', 'No se pudo subir la imagen del escudo.', 'error');
            return;
        }
    }

    const nuevoClub = {
      nombre,
      pais,
      localidad,
      responsable,
      telefonoClub,
      faxClub,
      telefonoResponsable,
      email,
      idiomaContacto,
      escudo: escudoUrl,
      activo
    };
    const clubCreado = await createClub(nuevoClub as any);
    onCreated?.(clubCreado);
    onClose();
  };

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <form onSubmit={handleSubmit}>
          <h3>Crear Club</h3>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Nombre</label>
              <input value={nombre} onChange={e => setNombre(e.target.value)} required />
            </div>
            <div className={styles.field}>
              <label>País</label>
              <input value={pais} onChange={e => setPais(e.target.value)} required />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Localidad</label>
              <input value={localidad} onChange={e => setLocalidad(e.target.value)} required />
            </div>
            <div className={styles.field}>
              <label>Responsable</label>
              <input value={responsable} onChange={e => setResponsable(e.target.value)} />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Teléfono Club</label>
              <input value={telefonoClub} onChange={e => setTelefonoClub(e.target.value)} />
            </div>
            <div className={styles.field}>
              <label>Fax Club</label>
              <input value={faxClub} onChange={e => setFaxClub(e.target.value)} />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Teléfono Responsable</label>
              <input value={telefonoResponsable} onChange={e => setTelefonoResponsable(e.target.value)} />
            </div>
            <div className={styles.field}>
              <label>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Idioma de Contacto</label>
              <input value={idiomaContacto} onChange={e => setIdiomaContacto(e.target.value)} />
            </div>
            <div className={styles.field}>
                <label>Escudo del Club</label>
                <input type="file" onChange={e => setEscudo(e.target.files ? e.target.files[0] : null)} />
            </div>
          </div>
          
          <div className={styles.row}>
            <div className={styles.field}>
              <label style={{ flexDirection: 'row', alignItems: 'center' }}>
                Activo
                <input type="checkbox" checked={activo} onChange={e => setActivo(e.target.checked)} style={{ width: 'auto', marginLeft: '1rem' }}/>
              </label>
            </div>
          </div>

          <div className={styles.row} style={{ justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="submit">Crear</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClubModal;

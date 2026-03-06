import { useEffect, useState } from 'react';
import type { Clubes } from '../../../types';
import styles from './Modal.module.css';
import { MdClose } from 'react-icons/md';

interface Props {
  open: boolean;
  club: Clubes | null;
  onClose: () => void;
  onSave: (cod: number, club: Clubes) => Promise<void>;
}

const EditClubModal = ({ open, club, onClose, onSave }: Props) => {
  const [nombre, setNombre] = useState('');
  const [pais, setPais] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [responsable, setResponsable] = useState('');
  const [telefonoClub, setTelefonoClub] = useState('');
  const [faxClub, setFaxClub] = useState('');
  const [telefonoResponsable, setTelefonoResponsable] = useState('');
  const [idiomaContacto, setIdiomaContacto] = useState('');
  const [email, setEmail] = useState('');
  const [activo, setActivo] = useState(true);

  useEffect(() => {
    if (club) {
      setNombre(club.nombre);
      setPais(club.pais);
      setLocalidad(club.localidad);
      setResponsable(club.responsable);
      setTelefonoClub(club.telefonoClub);
      setFaxClub(club.faxClub ?? '');
      setTelefonoResponsable(club.telefonoResponsable ?? '');
      setIdiomaContacto(club.idiomaContacto ?? '');
      setEmail(club.email);
      setActivo(club.activo);
    }
  }, [club]);

  if (!open || !club) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedClub = {
      ...club,
      nombre,
      pais,
      localidad,
      responsable,
      telefonoClub,
      faxClub,
      telefonoResponsable,
      idiomaContacto,
      email,
      activo,
    };
    await onSave(club.cod, updatedClub);
    onClose();
  };

  return (
    <div className={styles.darkOverlay}>
      <div className={styles.darkModal}>
        <button className={styles.closeIcon} onClick={onClose}>
          <MdClose size={28} />
        </button>
        <h3 className={styles.darkTitle}>Editar Club</h3>
        <form className={styles.darkForm} onSubmit={handleSubmit}>
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
          <div className={styles.field}>
            <label>Idioma de Contacto</label>
            <input value={idiomaContacto} onChange={e => setIdiomaContacto(e.target.value)} />
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label style={{ flexDirection: 'row', alignItems: 'center' }}>
                Activo
                <input type="checkbox" checked={activo} onChange={e => setActivo(e.target.checked)} style={{ width: 'auto', marginLeft: '1rem' }} />
              </label>
            </div>
          </div>
          <button type="submit" className={styles.darkBtn}>Guardar Cambios</button>
        </form>
      </div>
    </div>
  );
};

export default EditClubModal;

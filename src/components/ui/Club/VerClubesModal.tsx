import { useState, useEffect } from 'react';
import styles from './VerClubesModal.module.css';
import { getClubes } from '../../../api/clubesService';
import type { Clubes } from '../../../types';
import { FaArrowLeft, FaTimes, FaBuilding, FaMapMarkerAlt, FaUser, FaPhone, FaFax, FaEnvelope, FaLanguage, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

interface Props {
  open: boolean;
  onClose: () => void;
}

const VerClubesModal = ({ open, onClose }: Props) => {
  const [clubes, setClubes] = useState<Clubes[]>([]);
  const [selected, setSelected] = useState<Clubes | null>(null);

  useEffect(() => {
    if (open) {
      getClubes().then(setClubes);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}><FaTimes /></button>
        {!selected ? (
          <>
            <h3 className={styles.title}>Lista de Clubes</h3>
            <div className={styles.clubGrid}>
              {clubes.map(c => (
                <div key={c.cod} className={styles.clubCard} onClick={() => setSelected(c)}>
                  <div className={styles.clubIcon}><FaBuilding /></div>
                  <div className={styles.clubName}>{c.nombre}</div>
                  <div className={styles.clubLocalidad}>{c.localidad}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className={styles.clubDetails}>
            <div className={styles.detailsHeader}>
                <div className={styles.clubIcon}><FaBuilding /></div>
                <h4 className={styles.detailsTitle}>{selected.nombre}</h4>
            </div>
            <div className={styles.detailsGrid}>
                <DetailItem icon={<FaMapMarkerAlt />} label="País" value={selected.pais} />
                <DetailItem icon={<FaMapMarkerAlt />} label="Localidad" value={selected.localidad} />
                <DetailItem icon={<FaUser />} label="Responsable" value={selected.responsable} />
                <DetailItem icon={<FaPhone />} label="Teléfono Club" value={selected.telefonoClub} />
                <DetailItem icon={<FaFax />} label="Fax Club" value={selected.faxClub} />
                <DetailItem icon={<FaPhone />} label="Teléfono Responsable" value={selected.telefonoResponsable} />
                <DetailItem icon={<FaEnvelope />} label="Email" value={selected.email} />
                <DetailItem icon={<FaLanguage />} label="Idioma" value={selected.idiomaContacto} />
                <DetailItem icon={selected.activo ? <FaCheckCircle /> : <FaTimesCircle />} label="Activo" value={selected.activo ? 'Sí' : 'No'} />
            </div>
            <button className={styles.backButton} onClick={() => setSelected(null)}><FaArrowLeft /> Volver</button>
          </div>
        )}
      </div>
    </div>
  );
};

interface DetailItemProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
}

const DetailItem = ({ icon, label, value }: DetailItemProps) => (
    <div className={styles.detailItem}>
        <div className={styles.detailLabel}>{icon} {label}</div>
        <div>{value}</div>
    </div>
);

export default VerClubesModal;

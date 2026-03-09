
import { useState } from 'react';
import type { Equipos } from '../../../types';
import styles from './EquipoDetailModal.module.css';
import ImageModal from './ImageModal';

interface Props {
  equipo: Equipos | null;
  onClose: () => void;
}

const EquipoDetailModal = ({ equipo, onClose }: Props) => {
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  const handleOpenImageModal = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
    setImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setSelectedImageUrl(null);
    setImageModalOpen(false);
  };

  if (!equipo) {
    return null;
  }

  return (
    <>
      <div className={styles.carnetOverlay} onClick={onClose}>
        <div className={styles.carnetModal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h2>Detalles del Equipo</h2>
            <button className={styles.closeBtn} onClick={onClose}>&times;</button>
          </div>
          <div className={styles.modalContent}>
            <div className={styles.modalSection}>
              <h3>Información General</h3>
              <div className={styles.modalDatosGrid}>
                <div className={styles.modalDatoLabel}>Nombre</div>
                <div className={styles.modalDatoValue}>{equipo.nombreEquipo}</div>
                <div className={styles.modalDatoLabel}>Nombre corto</div>
                <div className={styles.modalDatoValue}>{equipo.corto}</div>
                <div className={styles.modalDatoLabel}>Grupo</div>
                <div className={styles.modalDatoValue}>{equipo.grupo}</div>
                <div className={styles.modalDatoLabel}>Categoría</div>
                <div className={styles.modalDatoValue}>{equipo.categoria?.nombre ?? 'N/A'}</div>
                <div className={styles.modalDatoLabel}>Club</div>
                <div className={styles.modalDatoValue}>{equipo.club?.nombre ?? 'N/A'}</div>
              </div>
            </div>
            <div className={styles.modalSection}>
              <h3>Fotos</h3>
              <div className={styles.modalFotosRow}>
                {equipo.fotoEquipo ? <img src={equipo.fotoEquipo} className={styles.modalFotoImg} onClick={() => handleOpenImageModal(equipo.fotoEquipo!)} /> : <div className={styles.modalFotoPlaceholder}>Equipo</div>}
                {equipo.fotoEquipacion1 ? <img src={equipo.fotoEquipacion1} className={styles.modalFotoImg} onClick={() => handleOpenImageModal(equipo.fotoEquipacion1!)} /> : <div className={styles.modalFotoPlaceholder}>Equipación 1</div>}
                {equipo.fotoEquipacion2 ? <img src={equipo.fotoEquipacion2} className={styles.modalFotoImg} onClick={() => handleOpenImageModal(equipo.fotoEquipacion2!)} /> : <div className={styles.modalFotoPlaceholder}>Equipación 2</div>}
              </div>
            </div>
            <div className={styles.modalSection}>
              <h3>Jugadores</h3>
              <table className={styles.modalTable}>
                <thead><tr><th>Foto</th><th>Nombre</th><th>Número</th><th>Demarcación</th></tr></thead>
                <tbody>
                  {equipo.jugadores?.length ? equipo.jugadores.map(j => (
                    <tr key={j.cod}>
                      <td>
                        {j.foto ? (
                          <img src={j.foto} alt={`${j.nombre} ${j.apellido}`} className={styles.tableFotoImg} onClick={() => handleOpenImageModal(j.foto)} />
                        ) : (
                          <div className={styles.tableFotoPlaceholder}>Sin foto</div>
                        )}
                      </td>
                      <td>{j.nombre} {j.apellido}</td>
                      <td>{j.numeroCamiseta}</td>
                      <td>{j.demarcacion}</td>
                    </tr>
                  )) : <tr><td colSpan={4} className={styles.modalTableEmpty}>No hay jugadores</td></tr>}
                </tbody>
              </table>
            </div>
            <div className={styles.modalSection}>
              <h3>Staff</h3>
              <table className={styles.modalTable}>
                <thead><tr><th>Foto</th><th>Nombre</th><th>Cargo</th></tr></thead>
                <tbody>
                  {equipo.staff?.length ? equipo.staff.map(s => (
                    <tr key={s.cod}>
                      <td>
                        {s.foto ? (
                          <img src={s.foto} alt={`${s.nombre} ${s.apellido}`} className={styles.tableFotoImg} onClick={() => handleOpenImageModal(s.foto)} />
                        ) : (
                          <div className={styles.tableFotoPlaceholder}>Sin foto</div>
                        )}
                      </td>
                      <td>{s.nombre} {s.apellido}</td>
                      <td>{s.cargo}</td>
                    </tr>
                  )) : <tr><td colSpan={3} className={styles.modalTableEmpty}>No hay staff</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <ImageModal
        isOpen={imageModalOpen}
        onClose={handleCloseImageModal}
        imageUrl={selectedImageUrl}
      />
    </>
  );
};

export default EquipoDetailModal;

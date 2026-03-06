import { useEffect, useState } from 'react';
import styles from './JugadoresScreen.module.css';
import SlideBoard from '../../ui/SlideBoard/SlideBoard';
import { FaPlus, FaTrash, FaEdit, FaEye } from 'react-icons/fa';
import CreateJugadorModal from '../../ui/Jugadores/CreateJugadorModal';
import EditJugadorModal from '../../ui/Jugadores/EditJugadorModal';
import ImageModal from '../../ui/Equipos/ImageModal';
import { getJugadoresByClub, setJugadorActivo, updateJugador } from '../../../api/jugadorService';
import type { Jugador } from '../../../types';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const JugadoresScreen = () => {
  const [jugadoresList, setJugadoresList] = useState<Jugador[]>([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [jugadorToEdit, setJugadorToEdit] = useState<Jugador | null>(null);
  const [selectedJugador, setSelectedJugador] = useState<Jugador | null>(null);
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

  useEffect(() => {
    const clubId = localStorage.getItem('clubId');
    if (clubId) {
      getJugadoresByClub(Number(clubId)).then(setJugadoresList);
    }
  }, []);

  const handleJugadorCreated = (nuevoJugador: Jugador) => {
    setJugadoresList(prev => [...prev, nuevoJugador]);
  };

  const handleJugadorUpdated = async (cod: number, updatedJugador: Jugador) => {
    try {
      const savedJugador = await updateJugador(cod, updatedJugador);
      setJugadoresList(prev =>
        prev.map(j => (j.cod === cod ? savedJugador : j))
      );
      MySwal.fire({
        icon: 'success',
        title: 'Actualizado',
        text: 'El jugador ha sido actualizado.',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error updating jugador:", error);
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el jugador.',
      });
    }
  };

  const handleView = (jugador: Jugador) => {
    setSelectedJugador(jugador);
  };

  const handleCloseModal = () => {
    setSelectedJugador(null);
  };

  const handleDelete = async (jugador: Jugador) => {
    const result = await MySwal.fire({
      title: '¿Eliminar jugador?',
      text: `¿Estás seguro que deseas eliminar a "${jugador.nombre} ${jugador.apellido}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e53935',
      cancelButtonColor: '#3182ce',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      if (!jugador.cod) return;
      await setJugadorActivo(jugador.cod, false);
      setJugadoresList(prev => prev.filter(j => j.cod !== jugador.cod));
      MySwal.fire({
        icon: 'success',
        title: 'Eliminado',
        text: 'El jugador ha sido eliminado.',
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className={styles.wrapper}>
      <SlideBoard />
      <div className={styles.panelContainer}>
        <div className={styles.header}>
          <h2 className={styles.panelTitle}>Jugadores del Club</h2>
          <button className={styles.createBtn} onClick={() => setOpenCreateModal(true)}>
            <FaPlus /> Crear Jugador
          </button>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.jugadorTable}>
            <thead>
              <tr>
                <th>Foto</th>
                <th>Nombre</th>
                <th>Número</th>
                <th>Demarcación</th>
                <th className={styles.actionsHeader}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {jugadoresList.filter(j => j.activo).map((jugador) => (
                <tr key={jugador.cod}>
                  <td>
                    {jugador.foto ? (
                      <img src={jugador.foto} alt={`${jugador.nombre} ${jugador.apellido}`} className={styles.tableFotoImg} onClick={() => handleOpenImageModal(jugador.foto)} />
                    ) : (
                      <div className={styles.tableFotoPlaceholder}>Sin foto</div>
                    )}
                  </td>
                  <td>{jugador.nombre} {jugador.apellido}</td>
                  <td>{jugador.numeroCamiseta}</td>
                  <td>{jugador.demarcacion}</td>
                  <td className={styles.actionsCell}>
                    <div className={styles.buttonGroup}>
                      <button
                        className={`${styles.iconButton} ${styles.viewBtn}`}
                        title="Ver"
                        onClick={() => handleView(jugador)}
                      >
                        <FaEye />
                      </button>
                      <button
                        className={`${styles.iconButton} ${styles.editBtn}`}
                        title="Editar"
                        onClick={() => {
                          setJugadorToEdit(jugador);
                          setOpenEditModal(true);
                        }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className={`${styles.iconButton} ${styles.deleteBtn}`}
                        title="Eliminar"
                        onClick={() => handleDelete(jugador)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Crear Jugador */}
        <CreateJugadorModal
          open={openCreateModal}
          onClose={() => setOpenCreateModal(false)}
          onCreated={handleJugadorCreated}
        />

        {/* Modal tipo carnet */}
        {selectedJugador && (
          <div className={styles.carnetOverlay} onClick={handleCloseModal}>
            <div className={styles.carnetModal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>Carnet Jugador</h2>
                <button className={styles.closeBtn} onClick={handleCloseModal}>&times;</button>
              </div>
              <div className={styles.modalContent}>
                <div className={styles.carnetHeader}>
                  {selectedJugador.foto ? (
                    <img
                      src={selectedJugador.foto}
                      alt="Foto Jugador"
                      className={styles.jugadorPhoto}
                      onClick={() => handleOpenImageModal(selectedJugador.foto)}
                    />
                  ) : (
                    <div className={styles.jugadorPhotoPlaceholder}>Sin foto</div>
                  )}
                  <div className={styles.jugadorInfo}>
                    <h3>{selectedJugador.nombre} {selectedJugador.apellido}</h3>
                    <p>{selectedJugador.demarcacion}</p>
                  </div>
                </div>

                <div className={styles.modalSection}>
                  <h3>Detalles</h3>
                  <div className={styles.modalDatosGrid}>
                    <div className={styles.modalDatoLabel}>Número:</div>
                    <div className={styles.modalDatoValue}>{selectedJugador.numeroCamiseta}</div>
                    <div className={styles.modalDatoLabel}>Equipo</div>
                    <div className={styles.modalDatoValue}>{selectedJugador.equipo?.nombreEquipo ?? 'N/A'}</div>
                    <div className={styles.modalDatoLabel}>Categoría</div>
                    <div className={styles.modalDatoValue}>{selectedJugador.categoria?.nombre ?? 'N/A'}</div>
                    <div className={styles.modalDatoLabel}>Goles</div>
                    <div className={styles.modalDatoValue}>{selectedJugador.goles}</div>
                    <div className={styles.modalDatoLabel}>Amarillas</div>
                    <div className={styles.modalDatoValue}>{selectedJugador.amarilla}</div>
                    <div className={styles.modalDatoLabel}>Rojas</div>
                    <div className={styles.modalDatoValue}>{selectedJugador.tarjetaRoja}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <ImageModal
          isOpen={imageModalOpen}
          onClose={handleCloseImageModal}
          imageUrl={selectedImageUrl}
        />

        {/* Editar Jugador */}
        <EditJugadorModal
          open={openEditModal}
          jugador={jugadorToEdit}
          onClose={() => setOpenEditModal(false)}
          onSave={handleJugadorUpdated}
        />
      </div>
    </div>
  );
};

export default JugadoresScreen;
import { useEffect, useState } from 'react';
import { Evento, getEventos, deleteEvento } from '../../../api/eventosService';
import styles from './EventosScreen.module.css';
import { MdEdit, MdDelete, MdAdd, MdVisibility, MdShuffle, MdSportsSoccer, MdArrowBack } from 'react-icons/md';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import CreateEditEventoModal from './CreateEditEventoModal';

const EventosScreen = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);
  const navigate = useNavigate();

  const fetchEventos = async () => {
    try {
      const data = await getEventos();
      setEventos(data);
    } catch (error) {
      console.error("Error fetching events", error);
      Swal.fire('Error', 'No se pudieron cargar los eventos.', 'error');
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Eliminar evento?',
      text: "No podrás revertir esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar'
    });

    if (result.isConfirmed) {
      try {
        await deleteEvento(id);
        fetchEventos();
        Swal.fire('Eliminado', 'El evento ha sido eliminado.', 'success');
      } catch (error) {
        console.error("Error deleting event", error);
        Swal.fire('Error', 'No se pudo eliminar el evento.', 'error');
      }
    }
  };

  const handleViewDetails = (id: number) => {
    navigate(`/eventos/ver/${id}`);
  };

  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setSelectedEvento(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (evento: Evento) => {
    setIsEditMode(true);
    setSelectedEvento(evento);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = () => {
    fetchEventos();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/admin')}>
            <MdArrowBack size={24} />
            Volver
        </button>
        <h1>Gestión de Eventos</h1>
        <div className={styles.headerActions}>
            <button className={styles.createBtn} onClick={handleOpenCreateModal}>
              <MdAdd size={24} />
              Crear Nuevo Evento
            </button>
        </div>
      </div>
      <div className={styles.grid}>
        {eventos.map(evento => (
          <div key={evento.id} className={styles.card}>
            <h2 className={styles.cardTitle}>{evento.nombre}</h2>
            <div className={styles.cardProperties}>
              <div className={styles.property}>
                <MdSportsSoccer size={28}/>
                <strong>Tipo:</strong> {evento.tipo}
              </div>
              <div className={styles.property}>
                <MdShuffle size={28}/>
                <strong>Orden de Encuentros:</strong> {evento.ordenEncuentros === 'AZAR' ? 'Al azar' : 'Manual'}
              </div>

            </div>
            <div className={styles.buttonGroup}>
              <button className={styles.viewBtn} onClick={() => handleViewDetails(evento.id)} title="Ver Detalles">
                  <MdVisibility size={22} /> Ver
              </button>
              <button className={styles.editBtn} onClick={() => handleOpenEditModal(evento)} title="Editar">
                <MdEdit size={22} /> Editar
              </button>
              <button className={styles.deleteBtn} onClick={() => handleDelete(evento.id)} title="Eliminar">
                <MdDelete size={22} /> Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
      <CreateEditEventoModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        evento={selectedEvento}
        isEditMode={isEditMode}
      />
    </div>
  );
};

export default EventosScreen;

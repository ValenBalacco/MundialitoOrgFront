
import { useEffect, useState } from 'react';
import { Evento, getEventos, deleteEvento } from '../../../api/eventosService';
import styles from './EventosScreen.module.css';
import { MdEdit, MdDelete, MdAdd, MdVisibility } from 'react-icons/md';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const EventosScreen = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Gestión de Eventos</h1>
        <button className={styles.createBtn} onClick={() => navigate('/eventos/crear')}>
          <MdAdd size={20} />
          Crear Nuevo Evento
        </button>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.eventTable}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Orden Encuentros</th>
              <th>Fases</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {eventos.map(evento => (
              <tr key={evento.id}>
                <td>{evento.nombre}</td>
                <td>{evento.tipo}</td>
                <td>{evento.ordenEncuentros}</td>
                <td>{evento.fases}</td>
                <td>
                  <div className={styles.buttonGroup}>
                    <button className={styles.viewBtn} onClick={() => handleViewDetails(evento.id)} title="Ver Detalles">
                        <MdVisibility size={20} />
                    </button>
                    <button className={styles.editBtn} onClick={() => navigate(`/eventos/editar/${evento.id}`)} title="Editar">
                      <MdEdit size={20} />
                    </button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(evento.id)} title="Eliminar">
                      <MdDelete size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventosScreen;

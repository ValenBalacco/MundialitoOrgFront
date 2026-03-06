
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEventoById, Evento, addClubToEvento, removeClubFromEvento, addEquipoToEvento, removeEquipoFromEvento } from '../../../api/eventosService';
import { getClubes, Clubes } from '../../../api/clubesService';
import { getEquipos, Equipos } from '../../../api/equiposService';
import styles from './VerEventoScreen.module.css';
import Swal from 'sweetalert2';
import GestionarPartidosModal from './GestionarPartidosModal';

const VerEventoScreen = () => {
  const { id } = useParams<{ id: string }>();
  const [evento, setEvento] = useState<Evento | null>(null);
  const [allClubs, setAllClubs] = useState<Clubes[]>([]);
  const [allEquipos, setAllEquipos] = useState<Equipos[]>([]);
  const [activeTab, setActiveTab] = useState<'general' | 'partidos'>('general');
  
  const [selectedClub, setSelectedClub] = useState<number | ''>('');
  const [selectedEquipo, setSelectedEquipo] = useState<number | ''>('');
  const [isPartidosModalOpen, setIsPartidosModalOpen] = useState(false);

  const fetchEventoDetails = async () => {
    if (id) {
      try {
        const eventoData = await getEventoById(Number(id));
        setEvento(eventoData);
      } catch (error) {
        console.error("Error fetching event details", error);
        Swal.fire('Error', 'No se pudieron cargar los detalles del evento.', 'error');
      }
    }
  };

  const fetchClubsAndEquipos = async () => {
    try {
      const clubsData = await getClubes();
      setAllClubs(clubsData);
      const equiposData = await getEquipos();
      setAllEquipos(equiposData);
    } catch (error) {
      console.error("Error fetching clubs or equipos", error);
    }
  };

  useEffect(() => {
    fetchEventoDetails();
    fetchClubsAndEquipos();
  }, [id]);

  const handleAddClub = async () => {
    if (id && selectedClub) {
      try {
        await addClubToEvento(Number(id), Number(selectedClub));
        fetchEventoDetails();
        Swal.fire('Club Agregado', 'El club ha sido agregado al evento.', 'success');
        setSelectedClub('');
      } catch (error) {
        console.error("Error adding club to event", error);
        Swal.fire('Error', 'No se pudo agregar el club.', 'error');
      }
    }
  };

  const handleRemoveClub = async (clubId: number) => {
    if (id) {
      try {
        await removeClubFromEvento(Number(id), clubId);
        fetchEventoDetails();
        Swal.fire('Club Eliminado', 'El club ha sido eliminado del evento.', 'success');
      } catch (error) {
        console.error("Error removing club from event", error);
        Swal.fire('Error', 'No se pudo eliminar el club.', 'error');
      }
    }
  };

  const handleAddEquipo = async () => {
    if (id && selectedEquipo) {
      try {
        await addEquipoToEvento(Number(id), Number(selectedEquipo));
        fetchEventoDetails();
        Swal.fire('Equipo Agregado', 'El equipo ha sido agregado al evento.', 'success');
        setSelectedEquipo('');
      } catch (error) {
        console.error("Error adding equipo to event", error);
        Swal.fire('Error', 'No se pudo agregar el equipo.', 'error');
      }
    }
  };

  const handleRemoveEquipo = async (equipoId: number) => {
    if (id) {
      try {
        await removeEquipoFromEvento(Number(id), equipoId);
        fetchEventoDetails();
        Swal.fire('Equipo Eliminado', 'El equipo ha sido eliminado del evento.', 'success');
      } catch (error) {
        console.error("Error removing equipo from event", error);
        Swal.fire('Error', 'No se pudo eliminar el equipo.', 'error');
      }
    }
  };


  if (!evento) {
    return <div>Cargando...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{evento.nombre}</h1>
        <div className={styles.details}>
          <span><strong>Tipo:</strong> {evento.tipo}</span>
          <span><strong>Orden:</strong> {evento.orden_encuentros}</span>
          {evento.tipo === 'MIXTO' && <span><strong>Fases:</strong> {evento.fases}</span>}
        </div>
        <div className={styles.tabs}>
          <button className={activeTab === 'general' ? styles.activeTab : ''} onClick={() => setActiveTab('general')}>General</button>
          <button className={activeTab === 'partidos' ? styles.activeTab : ''} onClick={() => setActiveTab('partidos')}>Partidos</button>
        </div>
      </div>

      {activeTab === 'general' && (
        <>
          <div className={styles.managementSection}>
            <h2>Gestionar Clubes</h2>
            <div className={styles.addSection}>
              <select value={selectedClub} onChange={(e) => setSelectedClub(Number(e.target.value))}>
                <option value="">Seleccionar Club</option>
                {allClubs.filter(c => !evento.clubes?.some(ec => ec.cod === c.cod)).map(club => (
                  <option key={club.cod} value={club.cod}>{club.nombre}</option>
                ))}
              </select>
              <button onClick={handleAddClub}>Agregar Club</button>
            </div>
            <ul className={styles.list}>
              {evento.clubes?.map(club => (
                <li key={club.cod}>
                  {club.nombre}
                  <button onClick={() => handleRemoveClub(club.cod)}>Eliminar</button>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.managementSection}>
            <h2>Gestionar Equipos</h2>
            <div className={styles.addSection}>
              <select value={selectedEquipo} onChange={(e) => setSelectedEquipo(Number(e.target.value))}>
                <option value="">Seleccionar Equipo</option>
                {allEquipos.filter(e => !evento.equipos?.some(ee => ee.cod === e.cod)).map(equipo => (
                  <option key={equipo.cod} value={equipo.cod}>{equipo.nombreEquipo}</option>
                ))}
              </select>
              <button onClick={handleAddEquipo}>Agregar Equipo</button>
            </div>
            <ul className={styles.list}>
              {evento.equipos?.map(equipo => (
                <li key={equipo.cod}>
                  {equipo.nombreEquipo}
                  <button onClick={() => handleRemoveEquipo(equipo.cod)}>Eliminar</button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      {activeTab === 'partidos' && (
        <div className={styles.managementSection}>
            <h2>Gestionar Partidos</h2>
            <button onClick={() => setIsPartidosModalOpen(true)}>Administrar Partidos</button>
        </div>
      )}
       {evento && (
        <GestionarPartidosModal
            open={isPartidosModalOpen}
            onClose={() => setIsPartidosModalOpen(false)}
            evento={evento}
        />
      )}
    </div>
  );
};

export default VerEventoScreen;

